import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Catering = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-8xl mx-auto px-4 flex flex-wrap items-center justify-center">
          {/* รูปภาพทางด้านซ้าย */}
          <div className="w-full md:w-2/5">
            <img
              src="/catering.png"
              alt="Zaab Classic"
              className="w-full h-auto"
            />
          </div>

          {/* ข้อความทางด้านขวา */}
          <div className="w-full md:w-3/5 px-6 text-black flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-6 text-center">
              Catering by{" "}
              <span className="text-[#e5af10]">
                Zaab Classic Thai Street Food
              </span>{" "}
              Bring the Taste of Thailand to Your Event!
            </h1>
            <p className="text-lg leading-relaxed mb-10">
              Planning a special event, corporate gathering, or private party?
              Let Zaab Classic Thai Street Food elevate your occasion with our
              authentic Thai catering services. From bold and spicy curries to
              refreshing salads and irresistible desserts, we bring the vibrant
              flavors of Thailand to your table, ensuring a memorable experience
              for you and your guests.
            </p>
            <Link to="/contact">
              <a className="inline-block bg-[#e5af10] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#c29000] transition duration-300 text-lg">
                Contact us
              </a>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Catering;
