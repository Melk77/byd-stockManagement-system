import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("token") || null;
  });


  const login = (data) => {
    const { token, user } = data;

    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  // Merges partial updates (e.g. a new username) into the stored user
  // so the UI reflects changes made on the account settings page
  // without requiring a re-login.
  const updateUser = (partialUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...partialUser };
      sessionStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };


  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};
