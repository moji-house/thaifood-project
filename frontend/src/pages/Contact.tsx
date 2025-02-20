import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !phone || !subject || !message) {
      return setError("Please fill in all required fields");
    }

    if (!/^\d{10}$/.test(phone)) {
      return setError("Invalid phone number (10 digits required)");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError("Invalid email address");
    }

    try {
      setIsLoading(true);

      // ส่งข้อมูลไปยัง Backend API
      await axios.post("http://localhost:3001/api/contacts", {
        firstname: firstName,
        lastname: lastName,
        email,
        phone_no: phone,
        subject,
        details: message,
      });

      // รีเซ็ตฟอร์มหลังส่งสำเร็จ
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setError(err.response?.data?.error || "Message submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gray-50 pt-24 pb-5">
        <div className="bg-white p-8 rounded-lg shadow-xl w-128">
          <h2 className="text-2xl font-bold mb-6 text-left">Contact Us</h2>

          {isSubmitted ? (
            <div className="text-center text-green-600 p-4">
              Thank you for your message! We'll contact you soon.
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* First Name & Last Name */}
                <div className="flex mb-4">
                  <div className="w-1/2 mr-2">
                    <label className="block text-gray-700 mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-gray-700 mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    pattern="[0-9]{10}"
                  />
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Your message
                  </label>
                  <textarea
                    className="w-full p-2 border rounded h-32"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#e5af10] text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Submit"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
