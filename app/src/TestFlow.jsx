import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useContext } from 'react';
import {BluetoothContext} from './components/BluetoothWrapper';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Pairing from './pages/Pairing';
import GameScan from './pages/GameScan';
import Welcome from './pages/Welcome';
import Home from './pages/Home';

function Layout() {
    return (
      <div>
        {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}
        <nav>
          <ul>
            <li>
              <Link to="/">Welcome</Link>
            </li>
            <li>
              <Link to="/btpair">Pair Device</Link>
            </li>
            <li>
              <Link to="/gamescan">Game Scan</Link>
            </li>
            <li>
              <Link to="/home">Home Screen</Link>
            </li>
          </ul>
        </nav>
  
        <hr />
  
        {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
        <Outlet />
      </div>
    );
}

function TestFlow() {
  const [status, setStatus] = useState('Idle');
  const {BTcontext} = useContext(BluetoothContext);
  const {initConnection, bleDevice, readFromDevice, writeToDevice, blStatus} = BTcontext;

  useEffect(() => {
    setStatus(blStatus);
  }, [blStatus]);

  return (
    <nav>
        <h3>- PEDRO Basic App -</h3>
        <p>
        { status }
        </p>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Welcome status={status} setStatus={setStatus} />} />
            <Route path="btpair" element={<Pairing status={status} setStatus={setStatus} />} />
            <Route path="gamescan" element={<GameScan status={status} setStatus={setStatus} />} />
            <Route path="home" element={<Home />} />

            {/* Using path="*"" means "match anything", so this route
                    acts like a catch-all for URLs that we don't have explicit
                    routes for. */}
            </Route>
        </Routes>
    </nav>

  );
}

export default TestFlow;
