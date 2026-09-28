
import { Users, PawPrint, FileText, Activity } from "lucide-react";
import "./adminDashboard.css";

export function AdminDashboard() {
  const statistics = [
    {
      title: "Користувачі",
      value: 25,
      icon: Users,
    },
    {
      title: "Тварини",
      value: 43,
      icon: PawPrint,
    },
    {
      title: "Оголошення",
      value: 51,
      icon: FileText,
    },
    {
      title: "Активні",
      value: 38,
      icon: Activity,
    },
  ];

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-container">

        <div className="admin-dashboard-header">
          <h1>Адмін-панель</h1>
          <p>Керування системою PETFINDER</p>
        </div>

        <div className="admin-statistics">
          {statistics.map((statistic) => {
            const Icon = statistic.icon;

            return (
              <div className="admin-stat-card" key={statistic.title}>
                <div className="admin-stat-icon">
                  <Icon />
                </div>

                <div>
                  <span>{statistic.title}</span>
                  <strong>{statistic.value}</strong>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}