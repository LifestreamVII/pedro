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

  const handleCartridgeDetected = () => {
    console.log("Cartridge detected");
    setIsCartridgeDetected(true);
    setError(null); // Clear any previous error
    onError(null);
  };

  const handleBluetoothError = (error: string | null) => {
    console.log("Bluetooth error:", error);
    setIsCartridgeDetected(false);
    setError(error);
    onError(error);
  };

  const handleNavigate = () => {
    history.push("/next-page"); // Remplacez "/next-page" par le chemin de votre page de destination
  };

  return (
    <div className="CartridgeLoader">
      <h2>First, we need some information about your game.</h2>
      <div className="cartridge-placeholder">
        <div
          className={`cartridge-icon ${isCartridgeDetected ? "detected" : ""}`}
        />
      </div>

      {!isCartridgeDetected && !error && (
        <>
          <div className="LoadingSpinner">
            <Spinner animation="border" />
          </div>
          <div className="Cartouche"></div>
          <div className="loader">Waiting for a cartridge...</div>
        </>
      )}

      {error && <div className="error">Bluetooth scanning failed: {error}</div>}

      {isCartridgeDetected && !error && (
        <>
          <div className="cartoucheDect"></div>
          <button className="nav" onClick={handleNavigate}>
            Go to Next Page
          </button>
        </>
      )}

      <BluetoothDetector
        onCartridgeDetected={handleCartridgeDetected}
        onError={handleBluetoothError}
      />
    </div>
  );
};

export default CartoucheNeed;
