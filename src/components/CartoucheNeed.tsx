import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useHistory } from "react-router-dom";
import "../styles/Cartouche.css";
import BluetoothDetector from "./BluetoothDetector";

interface CartoucheNeedProps {
  onError: (error: string | null) => void;
}

const CartoucheNeed: React.FC<CartoucheNeedProps> = ({ onError }) => {
  const [isCartridgeDetected, setIsCartridgeDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  // Gère le cas où une cartouche est détectée avec succès
  const handleCartridgeDetected = () => {
    console.log("Cartridge detected");
    setIsCartridgeDetected(true);
    setError(null); // Efface les erreurs précédentes
    onError(null);
  };

  // Gère les erreurs Bluetooth
  const handleBluetoothError = (error: string | null) => {
    console.log("Bluetooth error:", error);
    setIsCartridgeDetected(false);
    setError(error);
    onError(error);
  };

  // Redirige vers la page d'information une fois la cartouche détectée
  const handleNavigate = () => {
    history.push("/info");
  };

  return (
    <div className="CartridgeLoader">
      <h2>First, we need some information about your game.</h2>
      {/* Placeholder pour l'icône de la cartouche */}
      <div className="cartridge-placeholder">
        <div
          className={`cartridge-icon ${isCartridgeDetected ? "detected" : ""}`}
        />
      </div>

      {/* Affiche le spinner de chargement pendant la détection */}
      {!isCartridgeDetected && !error && (
        <>
          <div className="LoadingSpinner">
            <Spinner animation="border" />
          </div>
          <div className="Cartouche"></div>
          <div className="loader">Waiting for a cartridge...</div>
        </>
      )}

      {/* Affiche les erreurs Bluetooth */}
      {error && <div className="error">Bluetooth scanning failed: {error}</div>}

      {/* Affiche le contenu lorsque la cartouche est détectée */}
      {isCartridgeDetected && !error && (
        <>
          <div className="cartoucheDect"></div>
        </>
      )}

      {/* Composant BluetoothDetector pour détecter la cartouche */}
      <BluetoothDetector
        onCartridgeDetected={handleCartridgeDetected}
        onError={handleBluetoothError}
      />
    </div>
  );
};

export default CartoucheNeed;
