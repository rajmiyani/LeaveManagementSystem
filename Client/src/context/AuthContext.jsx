import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const login = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setAuthUser(user);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);