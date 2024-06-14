import React from "react";
import { useState, useEffect, useContext } from "react";
import { BluetoothContext } from "../components/BluetoothWrapper";
import { useNavigate } from "react-router-dom";
import SaveExtraction from '../components/SaveExtraction';

function GameScan({ status }) {
  const { BTcontext } = useContext(BluetoothContext);
  const { bleDevice, blStatus, readFromDevice, writeToDevice, readStatus } = BTcontext;
  const [cartridge, setCartridge] = useState('https://p1.hiclipart.com/preview/704/349/176/nintendo-ds-rom-icons-nintendo-ds-cartridge.jpg');
  const [gameName, setGameName] = useState('');
  const [noBl, setNoBl] = useState(false);
  const navigate = useNavigate();

  const gameInfo = async () => {
    if (!bleDevice) {
      console.log("no bl device");
      setNoBl(true);
      return null;
    }

    let data = "CMD:IGME()";

    await writeToDevice(bleDevice, data);

    const result = await readFromDevice(bleDevice);
    if (result && result.length) {
      if (result.includes('POKEMON')) {
        setGameName(result);

        if (result.includes("POKEMON W"))
          setCartridge("games/w.png");
        else if (result.includes("POKEMON B"))
          setCartridge("games/b.png");
        else if (result.includes("IPKF"))
          setCartridge("games/dm.png");
        else if (result.includes("POKEMON PL"))
          setCartridge("games/pl.png");
      } else {
        retryGameInfo();
      }
    }

    return true;
  };

  const retryGameInfo = () => {
    setTimeout(() => {
      gameInfo();
    }, 4000);
  };

  useEffect(() => {
    gameInfo();

    if (noBl)
      return navigate("/btpair");

  }, [noBl]);

  return (
    <div>
      <img src={cartridge ?? ""} alt="" />
      <p>{gameName ?? ""}</p>
      {
        gameName.includes("POKEMON") ? (
            <div>
                <SaveExtraction></SaveExtraction>
                <button>Go Back</button>
            </div>
        ) : ("")
      }
    </div>
  );
}

export default GameScan;
