import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { signInWithGoogle, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
