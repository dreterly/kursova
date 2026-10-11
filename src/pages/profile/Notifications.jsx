import { Bell, MessageCircle, Eye, CheckCircle, ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./notifications.css";

export function Notifications() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      type: "comment",
      title: "Новий коментар",
      text: "Хтось додав коментар до вашого оголошення.",
      time: "10 хвилин тому",
    },
    {
      id: 2,
      type: "view",
      title: "Нове переглядання",
      text: "Ваше оголошення переглянули.",
      time: "1 годину тому",
    },
    {
      id: 3,
      type: "found",
      title: "Тварину знайдено",
      text: "Ваше оголошення було позначено як знайдене.",
      time: "2 години тому",
    },
  ];

  return (
    <main className="notifications-page">
      <div className="notifications-container">
        <div className="notifications-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="notifications-title">
            <div className="notifications-title-icon">
              <Bell />
            </div>

            <div>
              <h1>Сповіщення</h1>
              <p>Останні повідомлення та оновлення</p>
            </div>
          </div>
        </div>

        <div className="notifications-list">
          {notifications.map((notification) => {
            let Icon = Bell;

            if (notification.type === "comment") {
              Icon = MessageCircle;
            }

            if (notification.type === "view") {
              Icon = Eye;
            }

            if (notification.type === "found") {
              Icon = CheckCircle;
            }

            return (
              <div key={notification.id} className="notification-card">
                <div className="notification-icon">
                  <Icon />
                </div>

                <div className="notification-content">
                  <h3>{notification.title}</h3>

                  <p>{notification.text}</p>

                  <span>{notification.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
