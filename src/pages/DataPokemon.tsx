import React, { FunctionComponent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Navigation from "../components/Navigation";
import pokemonData from "../data/PokemonData"; // Import the data from the data module
import "../styles/data.css";

const DataPokemon: FunctionComponent = () => {
  const [progress, setProgress] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Save the data from the imported module to localStorage once the progress bar reaches 100%
          localStorage.setItem("pokemons", JSON.stringify(pokemonData));
          history.push("/dataPokemonView");
        }
        return newProgress;
      });
    }, 1000); // Update every 1 second
    return () => clearInterval(interval);
  }, [history]);

  return (
    <>
      <div className="data-container">
        <div className="Box">
          <div className="data"></div>
          <p>Reading from Local Storage (cache)</p>
          <h1>Decrypting....</h1>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          {progress >= 100 ? (
            <div className="msg">Data loaded and saved to localStorage</div>
          ) : null}
        </div>
      </div>
      <Navigation />
    </>
  );
};

export default DataPokemon;
