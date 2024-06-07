import "bootstrap/dist/css/bootstrap.min.css";
import React, { FunctionComponent } from "react";
import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import NFCReader from "./components/NFCReader";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const App: FunctionComponent = () => {
  return (
    <div className="App">
      <Router>
        <div>
          {/* barre de navigation pour toutes les pages */}
          <header className="App-header">
            <nav className="nav">
              <div className="header-custom">
                <Link className="nav-header-custom" to="/">
                  PEDRO
                </Link>
                <Link className="nav-header-custom" to="/test">
                  TEST
                </Link>
              </div>
            </nav>
          </header>
          {/* System de gestion des routes de notre application */}
          {/* vers attention a l'ordre des routes */}
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/test" component={NFCReader}></Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
