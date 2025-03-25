import { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User, supabase } from "../lib/supabase";

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setState({
        user: data as User,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to sign in with Google",
      }));
    }
  };

  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to sign out",
      }));
    }
  };

  const value = {
    ...state,
    signInWithGoogle,
    signOut,
    isAdmin: state.user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
