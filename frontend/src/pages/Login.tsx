import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // เรียก API Login ที่ Backend
      await api.post("/user/login", { email, password });

      // เรียก API เพื่อรับข้อมูลผู้ใช้ปัจจุบัน
      const meResponse = await api.get("/user/me");
      login(meResponse.data.user); // บันทึกข้อมูลผู้ใช้

      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 pt-10">
        {/* Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-xl w-128">
          <h2 className="text-2xl font-bold mb-6 text-center">Log in</h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-64 bg-[#e5af10] text-white font-bold py-2 rounded-lg hover:bg-red-700"
              >
                Log in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Not registered yet? </span>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="inline-block bg-white text-black font-bold py-2 px-6 rounded-lg border border-gray-300 hover:bg-[#e5af10]"
            >
              Create an account
            </Link>
          </div>

          <p className="mt-8 text-sm text-gray-500 text-center">
            By logging in, you're confirming that you agree to our{" "}
            <a href="#" className="text-red-600 hover:underline">
              privacy policy
            </a>
            ,{" "}
            <a href="#" className="text-red-600 hover:underline">
              terms of use
            </a>
            , and{" "}
            <a href="#" className="text-red-600 hover:underline">
              cookie policy
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
