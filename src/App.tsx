import React, { FunctionComponent } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import DataPokemon from "./pages/DataPokemon";
import Home from "./pages/Home";
import Info from "./pages/Info";
import NFCReader from "./pages/NFCReader";
import NotFound from "./pages/NotFound";

const App: FunctionComponent = () => {
  return (
    <div className="App">
      <Router>
        {/* chemin d'acces des urls de nos pages */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/nfc" component={NFCReader} />
          <Route exact path="/info" component={Info} />
          <Route exact path="/dataPokemon" component={DataPokemon} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
