import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api.js";
import ProductImage from "../components/ProductImage.jsx";
import { formatPrice } from "../utils/format.js";

function stockMessage(stock) {
  if (stock <= 0) return { text: "Out of stock", className: "stock-out" };
  if (stock <= 5) return { text: `Only ${stock} left`, className: "stock-low" };
  return { text: "In stock", className: "stock-ok" };
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      try {
        const data = await apiRequest(`/api/products/${encodeURIComponent(id)}`);
        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  const stock = product ? stockMessage(product.stock) : null;

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to products
      </Link>

      {loading && <p className="state-message">Loading product...</p>}

      {error && <p className="error-box">{error}</p>}

      {product && (
        <div className="detail">
          <ProductImage product={product} />
          <div className="detail-info">
            <div className="tag-row">
              <span className="tag">{product.category}</span>
              {product.studentPick && <span className="tag tag-pick">Student Pick</span>}
            </div>
            <h1 className="page-title">{product.name}</h1>
            <p className="detail-price">{formatPrice(product.price)}</p>
            <p className={stock.className}>{stock.text}</p>
            <p>{product.description || "No description available."}</p>
          </div>
        </div>
      )}
    </div>
  );
}