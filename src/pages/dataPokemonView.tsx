import React, { FunctionComponent, useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import "../styles/data.css";

interface Pokemon {
  id: number;
  name: string;
  img: string;
}

const DataPokemonView: FunctionComponent = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    const loadedData = localStorage.getItem("pokemons");
    if (loadedData) {
      setPokemons(JSON.parse(loadedData));
    }
  }, []);

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleNFCActivate = async () => {
    if (!selectedPokemon) {
      alert("No Pokémon selected!");
      return;
    }

    if ("NDEFReader" in window) {
      const ndef = new window.NDEFReader();
      if (isWriting) {
        alert("Another NFC operation is in progress. Please wait.");
        return;
      }

      setIsWriting(true);
      try {
        await ndef.write({
          records: [
            {
              recordType: "text",
              data: JSON.stringify(selectedPokemon),
            },
          ],
        });
        alert(`Successfully transferred ${selectedPokemon.name} via NFC!`);
      } catch (error) {
        alert(
          `Failed to transfer data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsWriting(false);
      }
    } else {
      alert("NFC is not supported by your device.");
    }
  };

  return (
    <>
      <div className="pokemon-container">
        <h1>Box Viewer</h1>
        {pokemons.length > 0 ? (
          <ul>
            {pokemons.map((pokemon) => (
              <li
                key={pokemon.id}
                onClick={() => handlePokemonClick(pokemon)}
                style={{ cursor: "pointer" }}
              >
                <img src={pokemon.img} alt={pokemon.name} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No Pokémon data available.</p>
        )}
      </div>

      {selectedPokemon && (
        <span className="boxInformation">
          <div className="namePokemon">
            <h3>{selectedPokemon.name}</h3>
            <img src={selectedPokemon.img} alt={selectedPokemon.name} />
          </div>
          <button
            className="nfc"
            onClick={handleNFCActivate}
            disabled={isWriting}
            style={{
              display: "block",
              margin: "20px auto",
              padding: "10px 20px",
            }}
          >
            {isWriting ? "Transferring..." : "Activate NFC"}
          </button>
        </span>
      )}

      {!selectedPokemon && (
        <div className="boxInformation">
          <h3 className="select">Select a Pokémon</h3>
          <p className="select">
            Select a Pokémon to save on your NFC tag or an empty slot to import
            a Pokémon into.
          </p>
        </div>
      )}

      <Navigation />
    </>
  );
};

export default DataPokemonView;
