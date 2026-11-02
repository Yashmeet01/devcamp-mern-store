import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    const query = params.toString();

    async function loadProducts() {
      try {
        const data = await apiRequest(`/api/products${query ? `?${query}` : ""}`);
        if (ignore) return;
        setProducts(data);
        // the full list tells us which categories exist
        if (!search && category === "All") {
          setCategories([...new Set(data.map((p) => p.category))].sort());
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [search, category]);

  const changeFilters = (nextSearch, nextCategory) => {
    setLoading(true);
    setError("");
    setSearch(nextSearch);
    setCategory(nextCategory);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    changeFilters(searchInput.trim(), category);
  };

  const handleReset = () => {
    setSearchInput("");
    changeFilters("", "All");
  };

  const showPicks = !search && category === "All";
  const picks = products.filter((product) => product.studentPick);

  return (
    <div>
      <section className="hero">
        <h1 className="page-title">Welcome to CampusCart</h1>
        <p>Everything a student needs, in one place.</p>
      </section>

      <form className="search-form" onSubmit={handleSearchSubmit} role="search">
        <input
          type="search"
          placeholder="Search products by name"
          aria-label="Search products by name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn">
          Search
        </button>
      </form>

      <div className="chips">
        {["All", ...categories].map((name) => (
          <button
            key={name}
            type="button"
            className={`chip ${category === name ? "active" : ""}`}
            aria-pressed={category === name}
            onClick={() => changeFilters(search, name)}
          >
            {name}
          </button>
        ))}
      </div>

      {loading && <p className="state-message">Loading products...</p>}

      {error && <p className="error-box">{error}</p>}

      {!loading && !error && (
        <>
          {showPicks && picks.length > 0 && (
            <section className="picks">
              <h2 className="section-title">Student Picks</h2>
              <div className="product-grid">
                {picks.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="section-title">
              {showPicks ? "All products" : `Results (${products.length})`}
            </h2>

            {products.length === 0 ? (
              <div className="empty-state">
                <p>No products match your search.</p>
                <button type="button" className="btn" onClick={handleReset}>
                  Show all products
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}