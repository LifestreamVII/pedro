import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import BluetoothHandler from './helpers/bluetoothHandler';

function App() {

  const [status, setStatus] = useState('Idle');
  const {initConnection, bleDevice, readFromDevice, writeToDevice, status:blStatus} = BluetoothHandler();
  const [cartridge, setCartridge] = useState('https://p1.hiclipart.com/preview/704/349/176/nintendo-ds-rom-icons-nintendo-ds-cartridge.jpg');

  useEffect(() => {
    setStatus(blStatus);
  }, [blStatus]);

  const bluConnect = () => {
    setStatus('Begin BLE connection...');
    initConnection();
  }

  const bluInfo = async () => {
    setStatus('Showing DEBUG Info...');
    setStatus(JSON.stringify(bleDevice));
  }

  const bluRead = async (cached=true) => {
    let dev;
    if (bleDevice) {
      dev = bleDevice
    }

    if(!cached) {
      let data = "CMD:RECV()(0)";
      await writeToDevice(dev ?? null, data);
    }

    await readFromDevice(dev ?? null);
  }

  const bluSaveRead = async () => {
    let dev;
    if (bleDevice) {
      dev = bleDevice
    }

    let data = "CMD:RSAV()";
    await writeToDevice(dev ?? null, data);
    await readFromDevice(dev ?? null);
  }

  const gameInfo = async () => {
    setStatus('Detecting Game...');
    let dev;
    if (bleDevice) {
      dev = bleDevice
    }

    let data = "CMD:IGME()";
    await writeToDevice(dev ?? null, data);

    await readFromDevice(dev ?? null);

    if (blStatus.includes("POKEMON W"))
      setCartridge("games/w.png")
    else if (blStatus.includes("POKEMON B"))
      setCartridge("games/b.png")
    if (blStatus.includes("POKEMON D"))
      setCartridge("games/dm.png")
    else if (blStatus.includes("POKEMON PL"))
      setCartridge("games/pl.png")
    }

  return (
    <div className="App">
      <header className="App-header">
        <h3>- PEDRO Debug Menu -</h3>
        <img className="App-logo" src={cartridge} alt="" srcset="" />
        <p>
          { status }
        </p>
        <button onClick={bluConnect}>Test Bluetooth Connection</button>
        <button onClick={bluInfo}>Show Bluetooth Info</button>
        <button onClick={()=>{bluRead(false)}}>Show BLE Cached Value</button>
        <button onClick={gameInfo}>Test Game Detection</button>
        <button onClick={bluSaveRead}>Test Save Data Extraction (No DB)</button>
        <button onClick={bluInfo}>Test Save Data Extraction (Local DB)</button>
        <button>Show Trainer Data</button>
        <button>Test NFC Read</button>
        <button>Test NFC Write</button>
        <button>Test .PKM Decode</button>
        <button>Test .PKM Creation </button>
      </header>
    </div>
  );
}

export default App;
