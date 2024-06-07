import React, { useEffect, useState } from "react";

const NFCReader: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [message2, setMessage2] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Détection d'un appareil mobile : Expression régulière pour détecter le device
    const isMobileDevice = () => {
      setIsMobile(true);
      return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop|BlackBerry|BB10|PlayBook/i.test(
        navigator.userAgent
      );
    };

    if (!isMobileDevice()) {
      setIsMobile(false);
      setMessage2("Tu n'es pas sur un mobile");
      setMessage("NFC n'est pas pris en charge sur les ordinateurs.");
    } else {
      setMessage2("Tu es sur un mobile");
    }
  }, []);

  const startNFC = async () => {
    if (!isMobile) {
      setMessage("NFC n'est pas pris en charge sur les ordinateurs.");
      return;
    }

    if ("NDEFReader" in window) {
      const ndef = new (window as any).NDEFReader();

      try {
        await ndef.scan();
        setMessage("NFC scanning...");
        ndef.onreading = (event: any) => {
          const nfcMessages = event.message.records.map((record: any) => {
            if (record.recordType === "text") {
              const textDecoder = new TextDecoder(record.encoding || "utf-8");
              return textDecoder.decode(record.data);
            } else {
              return `Non-text record type: ${record.recordType}`;
            }
          });
          setMessage(`NFC reading successful: ${nfcMessages.join(", ")}`);
        };
        ndef.onreadingerror = () => {
          setMessage("NFC reading failed.");
        };
      } catch (error) {
        if ((error as Error).name === "NotAllowedError") {
          setMessage(
            "NFC scanning failed: Permission denied. Please allow NFC permissions and try again."
          );
        } else if (error instanceof Error) {
          setMessage(`NFC scanning failed: ${error.message}`);
        } else {
          setMessage("NFC scanning failed: Unknown error occurred.");
        }
      }
    } else {
      setMessage("NFC is not supported by your device.");
    }
  };

  return (
    <div>
      <h1>NFC Reader</h1>
      <p>{message}</p>
      <p>{message2}</p>
      {isMobile}
      <br></br>
      {isMobile && <button onClick={startNFC}>Start NFC Scan</button>}
    </div>
  );
};

export default NFCReader;
