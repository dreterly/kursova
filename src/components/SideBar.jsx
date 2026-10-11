import { useEffect, useState } from "react";
import { House, Map, Circle, UserCog, Navigation } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getAnnouncements } from "../services/announcementsApi.js";
import "./sideBar.css";
export function SideBar() {
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadAnnouncements();
  }, []);
  const lostCount = announcements.filter(
    (announcement) => announcement.type === "lost",
  ).length;
  const foundCount = announcements.filter(
    (announcement) => announcement.type === "found",
  ).length;
  return (
    <aside className="sidebar">
      {" "}
      <div className="sidebar-content">
        {" "}
        <div className="sidebar-section">
          {" "}
          <p className="sidebar-title"> Навігація </p>{" "}
          <nav className="sidebar-nav">
            {" "}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {" "}
              <span className="link-content">
                {" "}
                <House /> <span>Головна</span>{" "}
              </span>{" "}
            </NavLink>{" "}
            <NavLink
              to="/gps"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {" "}
              <span className="link-content">
                {" "}
                <Navigation /> <span>GPS-Моніторинг</span>{" "}
              </span>{" "}
            </NavLink>{" "}
            <NavLink
              to="/map"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {" "}
              <span className="link-content">
                {" "}
                <Map /> <span>Карта пошуку</span>{" "}
              </span>{" "}
            </NavLink>{" "}
          </nav>{" "}
        </div>{" "}
        <div className="sidebar-section">
          {" "}
          <p className="sidebar-title"> Оголошення </p>{" "}
          <nav className="sidebar-nav">
            {" "}
            <NavLink
              to="/lost"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link announcement-link active"
                  : "sidebar-link announcement-link"
              }
            >
              {" "}
              <span className="link-content">
                {" "}
                <Circle className="lost-dot" /> <span>Загублені</span>{" "}
              </span>{" "}
              <span className="counter lost-counter"> {lostCount} </span>{" "}
            </NavLink>{" "}
            <NavLink
              to="/found"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link announcement-link active"
                  : "sidebar-link announcement-link"
              }
            >
              {" "}
              <span className="link-content">
                {" "}
                <Circle className="found-dot" /> <span>Знайдені</span>{" "}
              </span>{" "}
              <span className="counter found-counter"> {foundCount} </span>{" "}
            </NavLink>{" "}
          </nav>{" "}
        </div>{" "}
      </div>{" "}
      <div className="sidebar-settings">
        {" "}
        <NavLink
          to="/profile/settings"
          className={({ isActive }) =>
            isActive ? "settings-link active" : "settings-link"
          }
        >
          {" "}
          <UserCog /> <span>Налаштування кабінету</span>{" "}
        </NavLink>{" "}
      </div>{" "}
    </aside>
  );
}
