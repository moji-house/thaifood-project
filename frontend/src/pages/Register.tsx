import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return setError("Please fill in all required fields");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (!/^\d{10}$/.test(telephone)) {
      return setError("Invalid telephone number (10 digits required)");
    }

    try {
      setIsLoading(true);

      // ส่งข้อมูลไปยัง Backend API
      await axios.post("/api/user/register", {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        phone_no: telephone,
        role: "user", // ตั้งค่าเริ่มต้นเป็น user
      });

      // Redirect ไปหน้า Login เมื่อสมัครสำเร็จ
      navigate("/login");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 pt-24 pb-5">
        <div className="bg-white p-8 rounded-lg shadow-xl w-128">
          <h2 className="text-2xl font-bold mb-6 text-left">
            Create an Account
          </h2>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First Name & Last Name */}
            <div className="flex mb-4">
              <div className="w-1/2 mr-2">
                <label className="block text-gray-700 mb-2">First name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 mb-2">Last name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Telephone */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Telephone number
              </label>
              <input
                type="tel"
                className="w-full p-2 border rounded"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                pattern="[0-9]{10}"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#e5af10] text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Create an account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-red-600 hover:underline">
              Log in
            </Link>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-8 text-sm text-gray-500 text-center">
            <p>
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="text-red-600 hover:underline">
                Terms and Conditions
              </Link>
              . Please read our{" "}
              <Link to="/privacy" className="text-red-600 hover:underline">
                Privacy Statement
              </Link>{" "}
              and{" "}
              <Link
                to="/cookie-policy"
                className="text-red-600 hover:underline"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
