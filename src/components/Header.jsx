import { useState } from "react";
import { PawPrint, User, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.js";
import "./header.css";

export default function Header() {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  function handleSearch(event) {
    event.preventDefault();

    const searchText = search.trim();

    if (!searchText) {
      navigate("/lost");
      return;
    }

    navigate(`/lost?search=${encodeURIComponent(searchText)}`);
  }

  function handleLogout() {
    setShowMenu(false);
    logout();
    navigate("/login");
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        <PawPrint className="logo-icon" size={50} strokeWidth={2.5} />

        <h1>
          PET<span>FINDER</span>
        </h1>
      </Link>

      <form className="home-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Пошук тварини..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button type="submit">Пошук</button>
      </form>

      <Link to="/create-announcement" className="create-button">
        + Створити оголошення
      </Link>

      {user ? (
        <div className="profile-menu">
          <button
            className="profile-page"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>

            <span className="profile-name">{user.name}</span>

            <ChevronDown
              className={`profile-arrow ${showMenu ? "open" : ""}`}
              size={17}
            />
          </button>

          {showMenu && (
            <div className="profile-dropdown">
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setShowMenu(false)}
              >
                <User size={18} />
                <span>Особистий кабінет</span>
              </Link>

              <Link
                to="/profile/settings"
                className="dropdown-item"
                onClick={() => setShowMenu(false)}
              >
                <User size={18} />
                <span>Налаштування</span>
              </Link>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item logout-item"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Вийти</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="login-button">
          <div className="avatar">?</div>
          <span>Увійти</span>
        </Link>
      )}
    </header>
  );
}
