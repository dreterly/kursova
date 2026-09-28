
import "./adminUsers.css";

export function AdminUsers() {
  const users = [
    {
      id: 1,
      name: "Вікторія",
      email: "victoria@example.com",
      role: "user",
      registrationDate: "2026-09-01",
    },
    {
      id: 2,
      name: "Олександр",
      email: "oleksandr@example.com",
      role: "user",
      registrationDate: "2026-09-03",
    },
    {
      id: 3,
      name: "Марія",
      email: "maria@example.com",
      role: "user",
      registrationDate: "2026-09-05",
    },
    {
      id: 4,
      name: "Адміністратор",
      email: "admin@petfinder.com",
      role: "admin",
      registrationDate: "2026-08-20",
    },
  ];

  return (
    <main className="admin-users">
      <div className="admin-users-container">

        <div className="admin-users-header">
          <h1>Користувачі</h1>
          <p>Перегляд зареєстрованих користувачів PETFINDER</p>
        </div>

        <div className="admin-users-table-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ім'я</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Дата реєстрації</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`user-role ${user.role}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td>{user.registrationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}