import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (userData) => {
    localStorage.setItem("roleId", userData.roles?.[0]?.id);
    localStorage.setItem("roleName", userData.roles?.[0]?.name);
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };
  const logout = () => {
    localStorage.clear();
    navigate("/Kontabiliteti/");
  }; // setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
