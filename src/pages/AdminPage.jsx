import { useState, useEffect } from "react";
import supabase from "../supabase/supabaseClient";
import { toast } from "react-toastify";
import "../styles/adminPanel.css";

const AdminPage = () => {
  const [session, setSession] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageFile: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadProducts = async () => {
    setLoadingProducts(true);
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error(error);
    else setProducts(data);
    setLoadingProducts(false);
  };

  useEffect(() => {
    if (session) loadProducts();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleImageChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isEditing) {
      setEditingProduct({ ...editingProduct, imageFile: file });
    } else {
      setNewProduct({ ...newProduct, imageFile: file });
    }
  };

  const addOrUpdateProduct = async (e) => {
    e.preventDefault();
    setSaving(true);

    const productData = editingProduct || newProduct;
    let publicUrl = productData.image_url || "";

    if (productData.imageFile) {
      setUploading(true);
      const fileName = `${Date.now()}-${productData.imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, productData.imageFile);

      if (uploadError) {
        toast.error("Image upload failed");
        setSaving(false);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      publicUrl = data.publicUrl;
      setUploading(false);
    }

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update({
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          image_url: publicUrl,
        })
        .eq("id", editingProduct.id);

      if (error) toast.error("Failed to update product");
      else toast.success("Product updated!");
      setEditingProduct(null);
    } else {
      const { error } = await supabase.from("products").insert([
        {
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
          image_url: publicUrl,
        },
      ]);

      if (error) toast.error("Failed to add product");
      else toast.success("Product added!");
      setNewProduct({ name: "", price: "", description: "", imageFile: null });
    }

    loadProducts();
    setSaving(false);
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error("Failed to delete product");
    else {
      toast.success("Product deleted!");
      loadProducts();
    }
  };

  const login = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) toast.error("Login failed");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (!session) {
    return (
      <div className="admin-login-container">
        <h2 className="admin-title">Admin Login</h2>
        <form onSubmit={login} className="admin-login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="input-field"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="input-field"
          />
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </header>

      <div className="admin-content">
        {/* Left: form */}
        <section className="admin-form-section">
          <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
          <form onSubmit={addOrUpdateProduct} className="product-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editingProduct ? editingProduct.name : newProduct.name}
              onChange={handleChange}
              required
              className="input-field"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={editingProduct ? editingProduct.price : newProduct.price}
              onChange={handleChange}
              required
              className="input-field"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={
                editingProduct
                  ? editingProduct.description
                  : newProduct.description
              }
              onChange={handleChange}
              required
              className="textarea-field"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, !!editingProduct)}
              className="file-input"
            />
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-submit">
              {saving
                ? "Saving..."
                : editingProduct
                ? "Update Product"
                : "Add Product"}
            </button>
          </form>
        </section>

        {/* Right: products */}
        <section className="admin-products-section">
          <h2>Products</h2>
          {loadingProducts ? (
            <p>Loading products...</p>
          ) : (
            <div className="products-grid">
              {products.length > 0 ? (
                products.map((p) => (
                  <div key={p.id} className="product-card">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="no-image">No image</div>
                    )}
                    <div className="product-info">
                      <h3>{p.name}</h3>
                      <p>${p.price}</p>
                      <p className="desc">{p.description}</p>
                    </div>
                    <div className="product-actions">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="btn-edit">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
