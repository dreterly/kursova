import { House, Map, MapPin, Circle, UserCog } from "lucide-react";
import "./sideBar.css";
import { Link } from "react-router-dom";
export function SideBar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Навігація */}
        <div className="sidebar-section">
          <p className="sidebar-title">Навігація</p>
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link">
              <span>
                <House />
              </span>
              <span>Головна</span>
            </Link>
            <a href="#" className="sidebar-link active">
              <span>
                <MapPin />
              </span>
              <span>GPS-Моніторинг</span>
            </a>
            <a href="#" className="sidebar-link">
              <span>
                <Map />
              </span>
              <span>Карта пошуку</span>
            </a>
          </nav>
        </div>
        {/* Оголошення */}
        <div className="sidebar-section">
          <p className="sidebar-title">Оголошення</p>
          <nav className="sidebar-nav">
            <Link to="/lost" className="sidebar-link announcement-link">
              
              
                <span className="link-content">
                  <Circle color="#ff0000" /> <span>Загублені</span>
                </span>
             
              <span className="counter lost-counter">23</span>
           </Link>
            <Link to="/found" className="sidebar-link announcement-link">
              
              <span className="link-content">
                <Circle color="#1eff00" /> <span>Знайдені</span>
              </span>
              <span className="counter found-counter">41</span>
            </Link>
          </nav>
        </div>
      </div>
      {/* Налаштування */}
      <div className="sidebar-settings">
       <Link to='/profile/settings' className="settings-link">
          <UserCog color="#E6195E" />
          
          <span>Налаштування кабінету</span>
        </Link>
      </div>
    </aside>
  );
}
