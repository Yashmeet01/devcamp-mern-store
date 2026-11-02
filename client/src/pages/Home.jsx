import { useEffect, useState } from "react";
import { apiRequest } from "../api.js";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const data = await apiRequest("/api/products");
        if (!ignore) setProducts(data);
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
  }, []);

  return (
    <div>
      <h1 className="page-title">Welcome to CampusCart</h1>

      {loading && <p className="state-message">Loading products...</p>}

      {error && <p className="error-box">{error}</p>}

      {!loading && !error && (
        <>
          <p className="success-box">
            Connected to the backend. Loaded {products.length} products.
          </p>
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                {product.name} - ₹{product.price}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}