import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session to confirm we're authenticated
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("Session check:", {
          session: session
            ? {
                ...session,
                user: session.user
                  ? {
                      id: session.user.id,
                      email: session.user.email,
                    }
                  : null,
              }
            : null,
          sessionError,
        });

        if (sessionError) throw sessionError;

        if (!session?.user) {
          throw new Error("No user in session");
        }

        // First try to get the user
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        console.log("Fetch existing user result:", {
          existingUser,
          fetchError,
        });

        if (!existingUser) {
          // User doesn't exist, try to create
          console.log("Attempting to create new user:", {
            id: session.user.id,
            email: session.user.email,
          });

          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                role: "user",
                created_at: new Date().toISOString(),
              },
            ])
            .select()
            .single();

          console.log("Insert result:", { newUser, insertError });

          if (insertError) {
            console.error("Insert error details:", insertError);
            throw insertError;
          }
        }

        // Get the intended destination from state, or default to home
        const from = location.state?.from?.pathname || "/";
        console.log("Redirecting to:", from);
        navigate(from, { replace: true });
      } catch (err) {
        console.error("Authentication error:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during authentication";
        setError(errorMessage);
      }
    };

    handleCallback();
  }, [navigate, location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600">
            Authentication Error
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Completing sign in...</h2>
        <p className="mt-2 text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
