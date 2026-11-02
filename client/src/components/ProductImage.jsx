import { useState } from "react";

const COLORS = ["#cfe8e4", "#f9e3c0", "#dbe4f6", "#f3d5dc", "#e1efc8"];

function colorFor(category) {
  const total = [...category].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return COLORS[total % COLORS.length];
}

export default function ProductImage({ product }) {
  const [failed, setFailed] = useState(false);

  if (product.image && !failed) {
    return (
      <img
        className="product-image"
        src={product.image}
        alt={product.name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className="product-image placeholder"
      style={{ background: colorFor(product.category) }}
      aria-hidden="true"
    >
      {product.name.charAt(0).toUpperCase()}
    </div>
  );
}