import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    token: string;
  };
}

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await postAPI<
      LoginResponse,
      { email: string; password: string }
    >("/admin/login", { email, password });

    if (response.success && response.data?.token) {
      const token = response.data.token;
      const adminRole = response.data.role;
      const adminName = response.data.fullName;

      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_role", adminRole);
      localStorage.setItem("admin_name", adminName);

      navigate("/panel"); // ✅ WILL NAVIGATE NOW
    } else {
      setError(response.message || "Login failed");
    }
  } catch (err: any) {
    console.error("Login error:", err);
    setError("An error occurred during login");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_50%)] pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700 relative z-10 animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-gray-100 text-center mb-2 tracking-tight">
          Admin Panel
        </h2>
        <p className="text-gray-400 text-center mb-8 text-sm">
          Sign in to access the dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700/50 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

          {/* Password Field */}
        <div>
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-700/50 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
      placeholder="••••••••"
      required
      disabled={loading}
    />

    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
      tabIndex={-1}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>
</div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-500 text-center text-xs mt-6">
          Secure admin access only
        </p>
      </div>
    </div>
  );
}

export default LoginPage;