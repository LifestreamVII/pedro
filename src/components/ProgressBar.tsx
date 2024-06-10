import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import trainerData from "../data/dresseur.json";

const ProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          generateAndStoreJSON(); // Generate and store JSON in localStorage when progress reaches 100%
          redirectToAnotherPage(); // Redirect to another page after progress reaches 100%
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const generateAndStoreJSON = () => {
    // Convertir les données en JSON
    const json = JSON.stringify(trainerData);

    // Stocker les données JSON dans le localStorage
    localStorage.setItem("trainerData", json);
  };

  const redirectToAnotherPage = () => {
    history.push("/info");
  };

  return (
    <div
      style={{
        borderRadius: "5px",
        width: "70%",
        margin: "10px auto",
        padding: "1px",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "20px",
          backgroundColor: "#9c3fe4",
          borderRadius: "5px",
          transition: "width 0.5s",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
