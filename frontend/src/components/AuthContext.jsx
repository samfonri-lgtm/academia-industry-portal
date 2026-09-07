import { createContext, useContext, useEffect, useState } from "react";
import { meApi } from "../auth";

const AuthContext = createContext(null);

const STORAGE_KEY = "academia_session";

function readStoredSession() {
  try {
    const savedSession = localStorage.getItem(STORAGE_KEY);

    if (!savedSession) {
      return null;
    }

    const parsedSession = JSON.parse(savedSession);

    if (
      !parsedSession ||
      typeof parsedSession !== "object" ||
      !parsedSession.id ||
      !parsedSession.role ||
      !parsedSession.token ||
      !parsedSession.expiresAt ||
      new Date(parsedSession.expiresAt).getTime() <= Date.now()
    ) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsedSession;
  } catch (error) {
    console.error("Failed to restore session:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  }, [session]);

  // Validate a restored session against the backend once on load.
  // Only an explicit 401 clears it; network errors keep the user signed in.
  useEffect(() => {
    if (!session?.token) return;

    let cancelled = false;

    meApi()
      .then((data) => {
        if (!cancelled && data?.user) {
          setSession((current) =>
            current ? { ...current, ...data.user } : current
          );
        }
      })
      .catch((error) => {
        if (!cancelled && error?.status === 401) {
          setSession(null);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.token]);

  function login(userData) {
    if (!userData || typeof userData !== "object") {
      console.error("Invalid login data.");
      return false;
    }

    if (!userData.id || !userData.role || !userData.token || !userData.expiresAt) {
      console.error("Login failed: incomplete session data.");
      return false;
    }

    setSession(userData);
    return true;
  }

  function logout() {
    setSession(null);
  }

  const isAuthenticated = Boolean(session);

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
