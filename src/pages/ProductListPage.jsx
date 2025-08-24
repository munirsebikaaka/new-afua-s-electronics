import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    async function fetchFilters() {
      const { data: cats } = await supabase.from("products").select("category");
      const { data: brs } = await supabase.from("products").select("brand");
      if (cats)
        setCategories([
          ...new Set(cats.map((c) => c.category).filter(Boolean)),
        ]);
      if (brs) setBrands([...new Set(brs.map((b) => b.brand).filter(Boolean))]);
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
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

      const { data, count } = await query;
      if (data) {
        setProducts(data);
        setTotalProducts(count || 0);
      }
    }
    fetchProducts();
  }, [search, category, brand, priceRange, sort, page]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="product-list-page">
      <FilterBar
        {...{
          search,
          setSearch,
          category,
          setCategory,
          categories,
          brand,
          setBrand,
          brands,
          priceRange,
          setPriceRange,
          sort,
          setSort,
        }}
      />
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}
// src/pages/ProductList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function ProductList() {
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

  useEffect(() => {
    async function fetchFilters() {
      const { data: cats } = await supabase.from("products").select("category");
      const { data: brs } = await supabase.from("products").select("brand");
      if (cats)
        setCategories([
          ...new Set(cats.map((c) => c.category).filter(Boolean)),
        ]);
      if (brs) setBrands([...new Set(brs.map((b) => b.brand).filter(Boolean))]);
    }
    fetchFilters();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      let query = supabase.from("products").select("*", { count: "exact" });

      if (search) query = query.ilike("name", `%${search}%`);
      if (category) query = query.eq("category", category);
      if (brand) query = query.eq("brand", brand);
      if (priceRange)
        query = query.gte("price", priceRange[0]).lte("price", priceRange[1]);

      // sorting
      if (sort === "newest")
        query = query.order("created_at", { ascending: false });
      if (sort === "price_low")
        query = query.order("price", { ascending: true });
      if (sort === "price_high")
        query = query.order("price", { ascending: false });

      // pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error && data) {
        setProducts(data);
        setTotalProducts(count || 0);
      }
    }
    fetchProducts();
  }, [search, category, brand, priceRange, sort, page]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="product-list">
      <h1>All Products</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

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

      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.images?.[0] || "/placeholder.png"} alt={p.name} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
          </div>
        ))}
      </div>

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
    </div>
  );
}

// export default ProductList
