import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: "admin" | "user" | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      fetchRole(session?.user ?? null);
      if (!session) setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        fetchRole(currentSession?.user ?? null);
        if (!currentSession) setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (currentUser: User | null) => {
    if (!currentUser) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      // 1. By default, you might store roles in user_metadata or app_metadata
      // if storing in user_metadata: currentUser.user_metadata?.role
      
      // 2. Alternatively, if using a "profiles" table:
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user role:", error);
      }
      
      // We assume user_metadata takes precedence if not found in profiles for simplicity
      // Or default to 'user' if profiles table isn't built yet
      const finalRole = data?.role || currentUser.user_metadata?.role || "user";
      setRole(finalRole);
    } catch (err) {
      console.error("Error evaluating role:", err);
      setRole("user");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
