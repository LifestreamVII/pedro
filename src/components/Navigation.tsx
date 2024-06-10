import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom"; // Importez Link
import "../styles/Nav.css";

const Navigation: FunctionComponent = () => {
  return (
    <div className="Nav">
      {/* Barre de navigation pour toutes les pages */}
      <header className="navigation-">
        <div className="header-custom-me">
          <Link to="/nfc">
            {" "}
            {/* Utilisez Link pour naviguer vers la page d'information */}
            <i className="material-icons">adb</i>
          </Link>
          <Link to="/">
            <i className="material-icons">home</i>
          </Link>
          <Link to="/info">
            <i className="material-icons">help_outline</i>
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Navigation;
