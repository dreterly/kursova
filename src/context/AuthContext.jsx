
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: 1,
    name: "Вікторія",
    email: "victoria@example.com",
    phone: "+380 67 123 45 67",
  });

  const isAuthenticated = user !== null;

  function login(email, password) {
    // Поки що демо-вхід
    setUser({
      id: 1,
      name: "Вікторія",
      email: email,
      phone: "+380 67 123 45 67",
    });
  }

  function logout() {
    setUser(null);
  }

  function register(name, email, password) {
    // Поки що демо-реєстрація
    setUser({
      id: 1,
      name: name,
      email: email,
      phone: "",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}