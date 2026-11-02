import { Link } from "react-router-dom";
import ProductImage from "./ProductImage.jsx";
import { formatPrice } from "../utils/format.js";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <ProductImage product={product} />
      <div className="product-card-body">
        <div className="tag-row">
          <span className="tag">{product.category}</span>
          {product.studentPick && <span className="tag tag-pick">Student Pick</span>}
        </div>
        <span className="product-name">{product.name}</span>
        <span className="product-price">{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}