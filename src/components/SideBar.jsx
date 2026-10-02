import { House, Map, MapPin, Circle, UserCog } from "lucide-react";
import { NavLink } from "react-router-dom";

import { announcements } from "../data/announcements.js";

import "./sideBar.css";

export function SideBar() {
  // Рахуємо кількість загублених і знайдених оголошень
  const lostCount = announcements.filter(
    (announcement) => announcement.type === "lost",
  ).length;

  const foundCount = announcements.filter(
    (announcement) => announcement.type === "found",
  ).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Навігація */}
        <div className="sidebar-section">
          <p className="sidebar-title">Навігація</p>

          <nav className="sidebar-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              end
            >
              <span className="link-content">
                <House />
                <span>Головна</span>
              </span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              end
            >
              <span className="link-content">
                <MapPin />
                <span>GPS-Моніторинг</span>
              </span>
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              end
            >
              <span className="link-content">
                <Map />
                <span>Карта пошуку</span>
              </span>
            </NavLink>
          </nav>
        </div>

        {/* Оголошення */}
        <div className="sidebar-section">
          <p className="sidebar-title">Оголошення</p>

          <nav className="sidebar-nav">
            {/* Загублені */}
            <NavLink
              to="/lost"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link announcement-link active"
                  : "sidebar-link announcement-link"
              }
            >
              <span className="link-content">
                <Circle color="#ff0000" />
                <span>Загублені</span>
              </span>

              <span className="counter lost-counter">{lostCount}</span>
            </NavLink>

            {/* Знайдені */}
            <NavLink
              to="/found"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link announcement-link active"
                  : "sidebar-link announcement-link"
              }
            >
              <span className="link-content">
                <Circle color="#1eff00" />
                <span>Знайдені</span>
              </span>

              <span className="counter found-counter">{foundCount}</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Налаштування */}
      <div className="sidebar-settings">
        <NavLink
          to="/profile/settings"
          className={({ isActive }) =>
            isActive ? "settings-link active" : "settings-link"
          }
        >
          <UserCog />
          <span>Налаштування кабінету</span>
        </NavLink>
      </div>
    </aside>
  );
}
