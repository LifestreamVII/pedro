import "bootstrap/dist/css/bootstrap.min.css"; // Assurez-vous d'importer les styles de Bootstrap
import React from "react";
import Spinner from "react-bootstrap/Spinner";

function CustomLoader() {
  return (
    <div className="text-center">
      <Spinner className="Loader" animation="border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </Spinner>
      <p>Juste quelques secondes...</p>
    </div>
  );
}

export default CustomLoader;
