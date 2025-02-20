import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart(); // ดึงข้อมูลรถเข็น
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // คำนวณจำนวนสินค้าทั้งหมด
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // เคลียร์ค่า search input หลังจาก submit
    }
  };

  // ฟังก์ชันจัดการการ Logout
  const handleLogout = async () => {
    try {
      await logout(); // เรียกใช้ฟังก์ชัน logout จาก context
      navigate("/"); // กลับไปหน้า Home หลัง logout
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการ Logout:", error);
    }
  };

  return (
    <header className="bg-[#e5af10] shadow-md fixed w-full top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 py-0 flex items-center justify-between h-[70px]">
        {/* Logo */}
        <Link to="/" className="flex items-center h-full mr-auto">
          <img
            src="/logo.png"
            alt="ZAAB CLASSIC Logo"
            className="h-full object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-8 font-bold">
          <Link to="/" className="hover:text-red-600">
            Home
          </Link>
          <Link to="/menu" className="hover:text-red-600">
            Menu
          </Link>
          <Link to="/catering" className="hover:text-red-600">
            Catering
          </Link>
          <Link to="/contact" className="hover:text-red-600">
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 rounded-lg px-3 py-1"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FiSearch className="text-gray-500" />
            </button>
          </form>

          {/* Cart Icon */}
          {isAuthenticated && (
            <Link to="/cart" className="relative">
              <FiShoppingCart className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* Login/User */}
          {isAuthenticated ? (
            <div className="relative group">
              <span className="text-red-600 font-bold cursor-pointer">
                {user?.firstname}
              </span>
              <div className="hidden group-hover:block absolute top-full right-0 bg-white shadow-lg rounded-md p-2">
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-gray-100 w-full text-left px-4 py-2"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
