interface Navigator {
  bluetooth: {
    requestDevice: (options: RequestDeviceOptions) => Promise<BluetoothDevice>;
  };
}

interface RequestDeviceOptions {
  filters?: BluetoothRequestDeviceFilter[];
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

interface BluetoothRequestDeviceFilter {
  services?: BluetoothServiceUUID[];
  name?: string;
  namePrefix?: string;
  manufacturerId?: number;
  serviceDataUUID?: BluetoothServiceUUID[];
  appearance?: number;
}

type BluetoothServiceUUID = number | string;

interface BluetoothDevice {
  id: string;
  name?: string;
  gatt?: BluetoothRemoteGATTServer;
}

interface BluetoothRemoteGATTServer {
  device: BluetoothDevice;
  connected: boolean;
  connect: () => Promise<BluetoothRemoteGATTServer>;
  disconnect: () => void;
  getPrimaryService: (
    service: BluetoothServiceUUID
  ) => Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic: (
    characteristic: BluetoothCharacteristicUUID
  ) => Promise<BluetoothRemoteGATTCharacteristic>;
}

type BluetoothCharacteristicUUID = number | string;

interface BluetoothRemoteGATTCharacteristic {
  uuid: string;
  readValue: () => Promise<DataView>;
  writeValue: (value: BufferSource) => Promise<void>;
  startNotifications: () => Promise<BluetoothRemoteGATTCharacteristic>;
  stopNotifications: () => Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener: (
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => void;
}
//pour utiliser le bluetooth
