import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        {/* Add padding-top for fixed header */}
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center">
          {/* รูปภาพทางด้านซ้าย */}
          <div className="w-full md:w-2/5">
            <img
              src="/mainfood.png"
              alt="Zaab Classic"
              className="w-full h-auto"
            />
          </div>

          {/* ข้อความทางด้านขวา */}
          <div className="w-full md:w-3/5 px-6 text-black">
            <h1 className="text-4xl font-bold mb-6">
              Welcome to{" "}
              <span className="text-[#e5af10]">
                Zaab Classic Thai Street Food
              </span>{" "}
              - Authentic Thai Flavors in Berlin!
            </h1>
            <p className="text-lg leading-relaxed">
              Craving the vibrant, bold, and authentic taste of Thailand? At
              Zaab Classic Thai Street Food, we bring the heart of Thai street
              food straight to your table in Berlin. From spicy curries to
              savory noodles and refreshing desserts, every dish is crafted with
              traditional recipes and fresh ingredients to deliver an
              unforgettable culinary experience.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
