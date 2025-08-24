// =============================================
// ADMIN PAGE (Secure Dashboard)

import { useState, useEffect } from "react";
import supabase from "../supabase/supabaseClient";
// import supa from "../supabaseClient";

const AdminPage = () => {
  const [session, setSession] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image_url: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Auth session
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

  // Load products
  const loadProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error(error);
    else setProducts(data);
  };

  useEffect(() => {
    if (session) loadProducts();
  }, [session]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  // Upload image
  const handleImageUpload = async (e, isEditing = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    if (isEditing) {
      setEditingProduct({ ...editingProduct, image_url: imageUrl });
    } else {
      setNewProduct({ ...newProduct, image_url: imageUrl });
    }
  };

  // Add product
  const addProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("products").insert([newProduct]);
    if (error) console.error(error);
    else {
      alert("Product added!");
      setNewProduct({ name: "", price: "", description: "", image_url: "" });
      loadProducts();
    }
  };

  // Update product
  const updateProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("products")
      .update(editingProduct)
      .eq("id", editingProduct.id);

    if (error) console.error(error);
    else {
      alert("Product updated!");
      setEditingProduct(null);
      loadProducts();
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) console.error(error);
    else {
      alert("Product deleted!");
      loadProducts();
    }
  };

  // Login / Logout
  const login = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert("Login failed");
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
          onChange={(e) => handleImageUpload(e, !!editingProduct)}
        />

        {/* 👇 Image preview */}
        {editingProduct && editingProduct.image_url && (
          <div>
            <p>Preview:</p>
            <img src={editingProduct.image_url} alt="Preview" width="100" />
          </div>
        )}
        {!editingProduct && newProduct.image_url && (
          <div>
            <p>Preview:</p>
            <img src={newProduct.image_url} alt="Preview" width="100" />
          </div>
        )}

        <button type="submit">
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h3>Products</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.image_url ? (
              <img src={p.image_url} alt={p.name} width="50" />
            ) : (
              <span>[No Image]</span>
            )}
            {p.name} - ${p.price}
            <button onClick={() => setEditingProduct(p)}>Edit</button>
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
