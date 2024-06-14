import { useState } from "react";

const BluetoothHandler = () => {
  let bluetoothDevice;
  const SERVICE_UUID = "00000001-710e-4a5b-8d75-3e5b444bc3cf";
  const CHARACTERISTIC_UUID = "00000002-710e-4a5b-8d75-3e5b444bc3cf";
  
  let characteristic;
  let readCharacteristic;
  const [status, setStatus] = useState('Idle');
  const [bleDevice, setBleDevice] = useState(null);
  
  async function initConnection() {
      bluetoothDevice = null;
      try {
          setStatus('Requesting Bluetooth Device...');
          console.log(status);
          bluetoothDevice = await navigator.bluetooth.requestDevice({
              filters: [{ namePrefix: "raspberrypi" }],
              optionalServices: [SERVICE_UUID]
          })
          bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
          await connect();
      } catch(error) {
          setStatus('ERR! ' + error);
          console.log(status);
      }
  }

  function handleNotifications(event) {
    let value = event.target.value;
    const dec = new TextDecoder().decode(value);
    setStatus(dec);
    console.log('Notified of Change : ' + dec);
  }

  function readStatus() {
    return status;
  }
  
  async function connect() {
    await exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
      async function toTry() {
        time('Connecting to Bluetooth Device... ');
        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);
        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
        readCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
      },
      function success() {
        setStatus('Bluetooth Device connected : ' + readCharacteristic.service.device.name);
        setBleDevice(readCharacteristic);
        characteristic.startNotifications().then((_)=>{
          characteristic.addEventListener('characteristicvaluechanged', handleNotifications);
        }).catch((e)=>{
          setStatus('ERR! ' + e);
          console.log(status);
        });
        console.log(status);
        return true;
      },
      function fail() {
        time('Failed to reconnect');
      });
  }

  async function readFromDevice(dev=null) {
    try {
      if (!dev) {
        if (!readCharacteristic){
          if (!bluetoothDevice) await initConnection();
          else await connect();
        }
        dev = readCharacteristic;
      }
      const value = await dev.readValue();
      console.log(value)
      const dec = new TextDecoder().decode(value);
      setStatus('Value : ' + dec);
      return dec;
    } catch(error) {
        setStatus('ERR! ' + error);
        console.log(status);
    }
  }

  async function writeToDevice(dev=null, data="") {
    try {
      if (!dev) {
        if (!readCharacteristic){
          if (!bluetoothDevice) await initConnection();
          else await connect();
        }
        dev = characteristic;
      }
      characteristic = dev;
      await sendChunks(data);
    } catch(error) {
        setStatus('ERR! ' + error);
        console.log(status);
    }
  }

  async function sendChunks(data) {
      const maxChunkSize = 500;
      let isDat = !data.includes("CMD:");
      for (let i = 0; i < data.length; i += maxChunkSize) {
          const chunk = data.slice(i, i + maxChunkSize);
          if (isDat && i + maxChunkSize >= data.length) {
              await writeChunk("DAT:"+chunk+"|EOF");
          }
          else if (isDat) {
              await writeChunk("DAT:"+chunk);
          }
          else {
              await writeChunk(chunk);
          }
      }
  }

  function writeChunk(chunk) {
      return characteristic.writeValue(new TextEncoder().encode(chunk))
          .then(() => {
              setStatus(`Chunk written...`);
              console.log(status);
          })
          .catch(error => {
              setStatus('Error writing chunk:', error);
              console.log(status);
          });
  }
  
  function onDisconnected() {
    setStatus('Bluetooth Device disconnected');
    console.log(status);
    connect();
  }
  
  async function exponentialBackoff(max, delay, toTry, success, fail) {
    try {
      const result = await toTry();
      success(result);
    } catch(error) {
      if (max === 0) {
        return fail();
      }
      time('Retrying in ' + delay + 's... (' + max + ' tries left)');
      setTimeout(function() {
        exponentialBackoff(--max, delay * 2, toTry, success, fail);
      }, delay * 1000);
    }
  }
  
  function time(text) {
    setStatus(text);
    console.log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
  }
  
  return { initConnection, bleDevice, readFromDevice, writeToDevice, status, readStatus };
}

export default BluetoothHandler;