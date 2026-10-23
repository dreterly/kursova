import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  PawPrint,
  FileText,
  Activity,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import API_BASE_URL from "../../services/api.js";
import { useNavigate } from "react-router-dom";

import "./adminDashboard.css";

export function AdminDashboard() {
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAdminData() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не вдалося завантажити дані");
      }

      setAdminData(data);
    } catch (error) {
      console.error(error);
      setError(error.message || "Сталася помилка під час завантаження");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  const statistics = [
    {
      title: "Користувачі",
      value: adminData?.statistics?.users ?? 0,
      icon: Users,
      description: "Зареєстровані користувачі",
      path: "/admin/users",
    },
    {
      title: "Тварини",
      value: adminData?.statistics?.pets ?? 0,
      icon: PawPrint,
      description: "Тварини в системі",
      path: "/admin/pets",
    },
    {
      title: "Оголошення",
      value: adminData?.statistics?.announcements ?? 0,
      icon: FileText,
      description: "Усі оголошення",
      path: "/admin/announcements",
    },
    {
      title: "Активні",
      value: adminData?.statistics?.active ?? 0,
      icon: Activity,
      description: "Активні оголошення",
      path: "/admin/announcements",
    },
  ];

  if (loading) {
    return (
      <main className="admin-dashboard">
        <div className="admin-dashboard-state">
          <div className="admin-loader"></div>
          <p>Завантаження адмін-панелі...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-dashboard">
        <div className="admin-dashboard-container">
          <button
            type="button"
            className="admin-back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft />
            Повернутися назад
          </button>

          <div className="admin-error">
            <div className="admin-error-icon">
              <ShieldCheck />
            </div>

            <h2>Не вдалося завантажити дані</h2>

            <p>{error}</p>

            <button
              type="button"
              className="admin-retry-button"
              onClick={loadAdminData}
            >
              <RefreshCw />
              Спробувати ще раз
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-container">
        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate("/")}
        >
          <ArrowLeft />
          Повернутися назад
        </button>

        <div className="admin-dashboard-header">
          <div className="admin-title-icon">
            <ShieldCheck />
          </div>

          <div>
            <span className="admin-label">PETFINDER ADMIN</span>

            <h1>Адмін-панель</h1>

            <p>Керування системою та контроль основних показників</p>
          </div>
        </div>

        <div className="admin-welcome">
          <div>
            <span>Вітаємо,</span>

            <strong>{adminData?.user?.name || "Адміністратор"}!</strong>
          </div>

          <ShieldCheck />
        </div>

        <section className="admin-statistics-section">
          <div className="admin-section-title">
            <h2>Статистика системи</h2>

            <p>Основна інформація про користувачів, тварин та оголошення</p>
          </div>

          <div className="admin-statistics">
            {statistics.map((statistic) => {
              const Icon = statistic.icon;

              return (
                <button
                  type="button"
                  className="admin-stat-card"
                  key={statistic.title}
                  onClick={() => navigate(statistic.path)}
                >
                  <div className="admin-stat-icon">
                    <Icon />
                  </div>

                  <div className="admin-stat-content">
                    <span>{statistic.title}</span>

                    <strong>{statistic.value}</strong>

                    <small>{statistic.description}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
