import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";
import { useCart } from "../context/CartContext";

const ProductsPage = () => {
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // products per page

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase.from("products").select("*", { count: "exact" });

      // search
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      // sort
      query = query.order("price", { ascending: sort === "asc" });

      // pagination
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error loading products:", error.message);
        setProducts([]);
      } else {
        setProducts(data || []);
        if (count !== null) {
          setTotalPages(Math.ceil(count / limit));
        }
      }

      setIsLoading(false);
    };

    loadProducts();
  }, [search, sort, page]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div>
      <h2>Products</h2>

      {/* filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page when searching
          }}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* product list */}
      {isLoading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "15px",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center",
              }}>
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  No Image
                </div>
              )}

              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
        }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}>
          ⬅ Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
