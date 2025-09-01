import { useState, useEffect } from "react";
// import { supabase } from "../services/supabaseClient";
import supabase from "../supabase/supabaseClient";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, brand, priceRange, sort]);

  // Fetch filters safely
  useEffect(() => {
    async function fetchFilters() {
      try {
        const { data: cats } = await supabase
          .from("products")
          .select("category");
        if (cats)
          setCategories([
            ...new Set(cats.map((c) => c.category).filter(Boolean)),
          ]);
      } catch {
        console.warn("Category column missing, skipping...");
      }

      try {
        const { data: brs } = await supabase.from("products").select("brand");
        if (brs)
          setBrands([...new Set(brs.map((b) => b.brand).filter(Boolean))]);
      } catch {
        console.warn("Brand column missing, skipping...");
      }
    }
    fetchFilters();
  }, []);

  // Fetch products with filters, sorting, pagination
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      let query = supabase.from("products").select("*", { count: "exact" });

      if (search) query = query.ilike("name", `%${search}%`);
      if (category) query = query.eq("category", category);
      if (brand) query = query.eq("brand", brand);
      if (priceRange)
        query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);

      if (sort === "newest")
        query = query.order("created_at", { ascending: false });
      if (sort === "price_low")
        query = query.order("price", { ascending: true });
      if (sort === "price_high")
        query = query.order("price", { ascending: false });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (!error && data) {
        setProducts(data);
        setTotalProducts(count || 0);
      } else {
        console.error("Error fetching products:", error);
      }

      setLoading(false);
    }

    fetchProducts();
  }, [search, category, brand, priceRange, sort, page]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="product-list">
      <h1>All Products</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {brands.length > 0 && (
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        )}

        <div className="price-filter">
          <label>Price Range:</label>
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            min="0"
          />
          -
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            min="0"
          />
        </div>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>
      </div>

      {/* Products */}
      <div className="product-grid">
        {loading ? (
          <div className="spinner"></div>
        ) : products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image_url || "/placeholder.png"} alt={p.name} />
              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <p>{p.description}</p>
            </div>
          ))
        ) : (
          <p className="no-results">
            No products found{search ? ` for "${search}"` : ""}.
          </p>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
