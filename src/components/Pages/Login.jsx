import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { MOCK_USERS } from "../../data/mockData";
import { LogIn, Key, Mail } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useApp();
  const { isDark } = useTheme();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Find user by email (in a real app, this would be a backend call)
    const user = MOCK_USERS.find((u) => u.email === email);

    if (!user || password !== "password") {
      // In a real app, you'd use proper password hashing
      setError("Invalid email or password");
      return;
    }

    // Set the authenticated user in context
    login(user);
    showToast(`Welcome back, ${user.name}`);
    navigate("/");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-md w-full mx-4 ${
          isDark ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-lg p-8`}
      >
        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome to ProjecFlow
          </h1>
          <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-600 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-3 top-3 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Key
                className={`absolute left-3 top-3 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Sign In
          </button>
        </form>

        <div className="mt-8">
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Demo Accounts:
          </p>
          <div className="mt-2 space-y-2">
            {MOCK_USERS.map((user) => (
              <div
                key={user.id}
                className={`p-2 rounded ${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                } flex justify-between`}
              >
                <div>
                  <span
                    className={`font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.name}
                  </span>
                  <span
                    className={`ml-2 ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    ({user.email})
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.role === "Owner"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "Admin"
                      ? "bg-blue-100 text-blue-800"
                      : user.role === "Editor"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
          <p
            className={`mt-4 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Password for all accounts: "password"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
