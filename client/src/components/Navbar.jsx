import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          CampusCart
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/cart">Cart</NavLink>

          {user ? (
            <div className="nav-user">
              <span>Hi, {user.name}</span>
              <button type="button" className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}