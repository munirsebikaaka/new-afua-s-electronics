import { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
import supabase from "../supabase/supabaseClient";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");

  // pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // products per page

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      // figure out which rows to fetch
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // base query
      let query = supabase.from("products").select("*", { count: "exact" }); // count = total number of rows

      // apply search filter
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      // apply sort
      query = query.order("price", { ascending: sort === "asc" });

      // apply pagination (limit results)
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching products:", error.message);
        setProducts([]);
      } else {
        setProducts(data || []);

        // calculate total pages
        if (count !== null) {
          setTotalPages(Math.ceil(count / limit));
        }
      }

      setLoading(false);
    }

    fetchProducts();
  }, [search, sort, page]);

  return (
    <div>
      {/* filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page when searching
          }}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {/* product list */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          <div
            style={{
              display: "grid",
              gap: "15px",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}>
            {products.length > 0 ? (
              products.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                  }}>
                  <img
                    src={p.image_url || "/placeholder.png"}
                    alt={p.name}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "8px",
                    }}
                  />
                  <h3>{p.name}</h3>
                  <p>${p.price}</p>
                  <p>{p.description}</p>
                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>

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
      )}
    </div>
  );
}
