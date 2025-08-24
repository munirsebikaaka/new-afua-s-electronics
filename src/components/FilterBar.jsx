export default function FilterBar({
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
}) {
  return (
    <div className="filters">
      <input
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
        <label>Price:</label>
        <input
          type="number"
          value={priceRange[0]}
          onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
        />
        -
        <input
          type="number"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
        />
      </div>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="price_low">Price Low→High</option>
        <option value="price_high">Price High→Low</option>
      </select>
    </div>
  );
}
