import React, { useEffect, useState } from "react";
import CartoucheNeed from "../components/CartoucheNeed";
import InstallButton from "../components/InstallDownload";
import CustomLoader from "../components/Spinner";
import "../styles/Home.css";

const Home: React.FC = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleError = (error: string | null) => {
    setError(error);
  };

  return (
    <div className="boxHome">
      <InstallButton />
      <div className="logopedro"></div>
      {showLoader ? (
        <CustomLoader />
      ) : (
        <div>
          {error && <div className="Error"></div>}
          <CartoucheNeed onError={handleError} />
        </div>
      )}
    </div>
  );
};

export default Home;
