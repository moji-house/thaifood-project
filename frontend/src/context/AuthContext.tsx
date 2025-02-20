import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "../services/api";

type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone_no: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ตรวจสอบสถานะ Login เมื่อแอพโหลด
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get("/user/me");
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // บันทึกข้อมูลผู้ใช้ใน localStorage
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
      setUser(null);
      localStorage.removeItem("user"); // ลบข้อมูลผู้ใช้ออกจาก localStorage
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
