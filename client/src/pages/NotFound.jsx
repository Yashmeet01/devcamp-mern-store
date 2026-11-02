import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h1 className="page-title">Page not found</h1>
      <p className="state-message">
        That page doesn't exist. <Link to="/">Go back home</Link>.
      </p>
    </div>
  );
}