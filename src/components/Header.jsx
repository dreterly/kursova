
import { useState } from "react";
import { PawPrint, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import "./header.css";

export default function Header() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(event) {
    event.preventDefault();

    const searchText = search.trim();

    if (!searchText) {
      navigate("/lost");
      return;
    }

    navigate(`/lost?search=${encodeURIComponent(searchText)}`);
  }

  return (
    <header className="header">
      <Link to="/" className="logo">
        <h1>
          <PawPrint
            strokeWidth={2.25}
            color="#E6195E"
            size="50px"
          />
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

      <Link to="/create-announcement">
        <button className="create-button">
          + Створити оголошення
        </button>
      </Link>

      <Link to="/profile/notifications">
        <button className="notification">
          <Bell size={30} strokeWidth={2.25} />
        </button>
      </Link>

      <Link to="/profile">
        <button className="profile-page">
          <div className="avatar">В</div>
          <span>Вікторія ▾</span>
        </button>
      </Link>
    </header>
  );
}