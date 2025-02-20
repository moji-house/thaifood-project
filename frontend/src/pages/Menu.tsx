import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiPlus } from "react-icons/fi";

interface Product {
  id: number;
  name: string;
  image_url: string;
  description: string;
  price: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([
    { id: 0, name: "All" },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get(
          "http://localhost:3001/api/products"
        );
        setProducts(productsResponse.data);

        const categoriesResponse = await axios.get(
          "http://localhost:3001/api/categories"
        );
        setCategories([{ id: 0, name: "All" }, ...categoriesResponse.data]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory(0);
    }
  }, [location.search]);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    navigate("/menu");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory =
      selectedCategory === 0 || product.category_id === selectedCategory;
    return (!searchQuery && matchesCategory) || (searchQuery && matchesSearch);
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20">
        <div className="container mx-auto px-4 py-8 w-full max-w-6xl">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col"
              >
                <div className="flex-1">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2 text-sm">
                    {product.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-red-600 font-bold">
                    €{product.price.toFixed(2)}
                  </p>
                  {isAuthenticated && (
                    <button
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                      onClick={() =>
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image_url: product.image_url,
                        })
                      }
                    >
                      <FiPlus size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Menu;
