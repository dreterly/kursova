import { PawPrint, Bell } from "lucide-react";
import "./header.css";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header className="header">
      <h1>
        <PawPrint strokeWidth={2.25} color="#E6195E" size="50px" />
        PET<span color="#E6195E">FINDER</span>
      </h1>
      <div className="home-search">
        {" "}
        <input type="text" placeholder="Пошук тварини..." />{" "}
        <button>Пошук</button>{" "}
      </div>
      <Link to="/create-announcement">
        <button className="create-button"> + Створити оголошення </button>
      </Link>
      <Link to="/profile/notifications">
        <button className="notification">
          <Bell size={30} strokeWidth={2.25} />
        </button>
      </Link>
      <Link to="/profile">
        <button className="profile-page">
          <div className="avatar">В</div> <span>Вікторія ▾</span>{" "}
        </button>
      </Link>
    </header>
  );
}
