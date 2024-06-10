import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navigation from "../components/Navigation";
import "../styles/Info.css";

const Info: React.FC = () => {
  const [trainerData, setTrainerData] = useState<any>(null);
  const history = useHistory();

  useEffect(() => {
    const json = localStorage.getItem("trainerData");
    if (json) {
      const data = JSON.parse(json);
      setTrainerData(data);
    }
  }, []);

  const handleButtonClick = () => {
    history.push("/nfc");
  };

  const handleDataBase = () => {
    history.push("/dataPokemon");
  };

  return (
    <div>
      <div className="trainer-card">
        {trainerData && (
          <>
            <div className="trainer-image">
              <h2>Informations du Dresseur</h2>
              <img src={trainerData.img} alt="Trainer" />
            </div>
            <div className="trainer-info">
              <p>
                Trainer ID: <br /> <span>{trainerData.trainerId}</span>
              </p>
              <p>
                Prénom: <br /> <span>{trainerData.firstName}</span>
              </p>
              <p>
                Sexe: <br /> <span>{trainerData.sexe}</span>
              </p>
              <p>
                Badge: <br /> <span>{trainerData.badge}</span>
              </p>
              <p>
                Temps de jeu: <br /> <span>{trainerData.playTime}</span>
              </p>
            </div>
          </>
        )}
      </div>
      <div className="ButtonAction">
        <button className="custom-button">Start from cartridge</button>
        <button className="custom-button" onClick={handleDataBase}>
          Start from cartridge
        </button>
        <button className="custom-button" onClick={handleButtonClick}>
          ReadNFC
        </button>
      </div>

      <Navigation />
    </div>
  );
};

export default Info;
