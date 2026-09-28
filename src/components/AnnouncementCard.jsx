import { Link } from "react-router-dom";

import "./announcementCard.css";

export function AnnouncementCard({ announcement }) {
  return (
    <div className="announcement-card">
      <div className="announcement-card-image">
        <img src={announcement.image} alt={announcement.name} />

        <span
          className={`announcement-status ${
            announcement.status === "lost" ? "lost" : "found"
          }`}
        >
          {announcement.status === "lost" ? "Загублений" : "Знайдений"}
        </span>
      </div>

      <div className="announcement-card-content">
        <h3>{announcement.name}</h3>

        <p>📍 {announcement.city}</p>

        <p>
          {announcement.status === "lost"
            ? announcement.lostDate
            : announcement.foundDate}
        </p>

        <p>{announcement.description}</p>

        <Link
          to={`/announcements/${announcement.id}`}
          className="details-button"
        >
          Детальніше
        </Link>
      </div>
    </div>
  );
}
