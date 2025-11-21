import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);


const LOGIN_URL = `/api/auth/login`;      
const ME_URL = `/api/auth/me`;            
const LOGOUT_URL = `/api/auth/logout`;    
const CHECK_URL = `/api/auth/check`;      

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch(CHECK_URL, {
        method: "GET",
        credentials: "include",
        headers: { "Accept": "application/json" },
      });
      
      if (!res.ok) {
        setUser(null);
        return null;
      }
      
      const data = await res.json().catch(() => ({}));

      if (data?.authenticated && data?.user) {
        setUser(data.user);
        return data.user;
      }
      
      setUser(null);
      return null;
    } catch (e) {
      console.error('Auth check failed:', e);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        await fetchMe();
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [fetchMe]);

  const login = useCallback(async (username, password) => {
    const res = await fetch(LOGIN_URL, {
      method: "POST",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json" 
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let errText = "Login failed";
      try {
        const errJson = await res.json().catch(() => null);
        if (errJson?.message) {
          errText = errJson.message;
        } else if (errJson) {
          errText = JSON.stringify(errJson);
        }
      } catch (e) {
        errText = await res.text().catch(() => `HTTP ${res.status}`);
      }
      throw new Error(errText);
    }

    const data = await res.json().catch(() => ({}));
    const me = data?.user ?? data;
    
    if (me && me.username) {
      setUser(me);
      return me;
    }
    return await fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await fetch(LOGOUT_URL, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    isAuthed: !!user
  }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}