import { useState, useEffect } from "react";
import supabase from "../supabase/supabaseClient";
import { toast } from "react-toastify";

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

  const addProduct = async (e) => {
    e.preventDefault();
    setSaving(true);

    let publicUrl = "";

    if (newProduct.imageFile) {
      setUploading(true);
      const fileName = `${Date.now()}-${newProduct.imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, newProduct.imageFile);

      if (uploadError) {
        toast.error("Image upload failed");
        console.error(uploadError);
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

    const { error } = await supabase.from("products").insert([
      {
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        image_url: publicUrl,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Failed to add product");
    } else {
      toast.success("Product added!");
      setNewProduct({ name: "", price: "", description: "", imageFile: null });
      loadProducts();
    }

    setSaving(false);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setSaving(true);

    let publicUrl = editingProduct.image_url;

    if (editingProduct.imageFile) {
      setUploading(true);
      const fileName = `${Date.now()}-${editingProduct.imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, editingProduct.imageFile);

      if (uploadError) {
        toast.error("Image upload failed");
        console.error(uploadError);
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

    const { error } = await supabase
      .from("products")
      .update({
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        image_url: publicUrl,
      })
      .eq("id", editingProduct.id);

    if (error) {
      console.error(error);
      toast.error("Failed to update product");
    } else {
      toast.success("Product updated!");
      setEditingProduct(null);
      loadProducts();
    }

    setSaving(false);
  };

  const deleteProduct = async (id) => {
    setSaving(true);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error(error);
    else {
      toast.success("Product deleted!");
      loadProducts();
    }
    setSaving(false);
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
      <div className="admin-container">
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
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Admin Panel</h2>
      <button onClick={logout} className="btn-logout">
        Logout
      </button>

      <form
        onSubmit={editingProduct ? updateProduct : addProduct}
        className="product-form">
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
            editingProduct ? editingProduct.description : newProduct.description
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

      <h3 className="products-title">Products</h3>
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : (
        <ul className="products-list">
          {products.length > 0 &&
            products.map((p) => (
              <li key={p.id} className="product-item">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="product-image"
                  />
                ) : (
                  <span className="no-image">No image</span>
                )}
                <span className="product-name">
                  {p.name} - ${p.price}
                </span>
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
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;
