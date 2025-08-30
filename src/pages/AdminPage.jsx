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
      <div>
        <h2>Admin Login</h2>
        <form onSubmit={login}>
          <input type="email" name="email" placeholder="Email" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      <button onClick={logout}>Logout</button>

      <form onSubmit={editingProduct ? updateProduct : addProduct}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={editingProduct ? editingProduct.name : newProduct.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={editingProduct ? editingProduct.price : newProduct.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={
            editingProduct ? editingProduct.description : newProduct.description
          }
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, !!editingProduct)}
        />

        <button type="submit" disabled={saving || uploading}>
          {saving
            ? "Saving..."
            : editingProduct
            ? "Update Product"
            : "Add Product"}
        </button>
      </form>

      <h3>Products</h3>
      {loadingProducts ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.length > 0 &&
            products.map((p) => (
              <li key={p.id}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} width="50" />
                ) : (
                  <span>No image</span>
                )}
                {p.name} - ${p.price}
                <button onClick={() => setEditingProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p.id)}>Delete</button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;
