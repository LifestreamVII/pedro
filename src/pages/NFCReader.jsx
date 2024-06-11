import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import "../styles/data.css";
const NFCReader = () => {
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [nfcData, setNfcData] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  useEffect(() => {
    // Vérifie si l'appareil est mobile
    const mobileRegex =
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|BlackBerry|BB10|PlayBook/i;
    const deviceIsMobile = mobileRegex.test(navigator.userAgent);
    setIsMobile(deviceIsMobile);
    setMessage(
      deviceIsMobile
        ? "Please scan an NFC tag."
        : "NFC is not supported on this device."
    );
  }, []);

  const startNFC = async () => {
    if (!isMobile) {
      setMessage("NFC is not supported on this device.");
      return;
    }

    if ("NDEFReader" in window) {
      const ndef = new window.NDEFReader();
      if (isWriting) {
        setMessage("Another NFC operation is in progress. Please wait.");
        return;
      }

      setIsWriting(true);
      try {
        await ndef.scan();
        setMessage("Scanning NFC...");
        ndef.onreading = async (event) => {
          const record = event.message.records[0];
          if (record.recordType === "text") {
            const decoder = new TextDecoder();
            const text = decoder.decode(record.data);
            try {
              const parsedData = JSON.parse(text);
              setNfcData(parsedData);
              setMessage("NFC reading successful.");
            } catch (error) {
              setMessage("Error parsing NFC data.");
            }
          } else {
            setMessage("Unsupported NFC record type.");
          }
        };
        ndef.onreadingerror = () => {
          setMessage("Error reading NFC tag.");
        };
      } catch (error) {
        setMessage(
          `Error during NFC scan: ${error instanceof Error
            ? error.message
            : "An unknown error occurred."
          }`
        );
      } finally {
        setIsWriting(false);
      }
    } else {
      setMessage("NFC is not supported by your device.");
    }
  };

  const writeDataToNFC = async (pokemon) => {
    if ("NDEFWriter" in window) {
      const ndef = new window.NDEFWriter();
      if (isWriting) {
        setMessage("Another NFC operation is in progress. Please wait.");
        return;
      }

      setIsWriting(true);
      try {
        await ndef.write({
          records: [{ recordType: "text", data: JSON.stringify(pokemon) }],
        });
        setMessage(`Successfully transferred ${pokemon.name} via NFC!`);
      } catch (error) {
        setMessage(
          `Failed to transfer data: ${error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setIsWriting(false);
      }
    } else {
      setMessage("NFC writing is not supported by your device.");
    }
  };

  return (
    <div className="centerALL">
      <h1>NFC Reader</h1>
      <p>{message}</p>
      {isMobile && <button className="NFCclick" onClick={startNFC}>Start NFC Scan</button>}
      <br />
      {nfcData ? (
        <div className="affichageNFC">
          <h2>Pokémon Data:</h2>
          <p>Name: <strong>{nfcData.name}</strong></p>
          <img className="imgSize" src={nfcData.img} alt={nfcData.name} />
        </div>
      ) : (
        <p>No Pokémon data read.</p>
      )}
      <Navigation />
    </div>
  );
};

export default NFCReader;
