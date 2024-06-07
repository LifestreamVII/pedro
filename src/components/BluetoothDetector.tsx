import React, { useCallback, useState } from "react";

interface BluetoothDetectorProps {
  onCartridgeDetected: () => void;
  onError: (error: string | null) => void;
}

const BluetoothDetector: React.FC<BluetoothDetectorProps> = ({
  onCartridgeDetected,
  onError,
}) => {
  const [message, setMessage] = useState<string>("");

  const scanForBluetoothDevices = useCallback(async () => {
    if (!navigator.bluetooth) {
      const errorMsg = "Bluetooth API is not available on this device.";
      setMessage(errorMsg);
      onError(errorMsg);
      return;
    }

    try {
      const options = {
        acceptAllDevices: true,
        optionalServices: ["battery_service"],
      };
      console.log("Requesting Bluetooth device...");
      setMessage("Requesting Bluetooth device...");
      onError(null); // Clear any previous errors
      const device = await navigator.bluetooth.requestDevice(options);
      console.log("Device found:", device);
      setMessage(`Connected to device: ${device.name || "Unnamed Device"}`);

      // Wait for the device to be connected
      const server = await device.gatt?.connect();
      console.log("GATT server connected:", server);
      setMessage("GATT server connected.");

      setTimeout(() => {
        onCartridgeDetected(); // Execute callback after detection
      }, 3000);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Bluetooth scanning failed:", errorMessage);
      onError(errorMessage);
    }
  }, [onCartridgeDetected, onError]);

  return (
    <div>
      {message}
      <br></br>
      <button onClick={scanForBluetoothDevices}>
        Scan for Bluetooth Devices
      </button>
    </div>
  );
};

export default BluetoothDetector;
