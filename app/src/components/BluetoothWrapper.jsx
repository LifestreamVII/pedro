import { createContext } from 'react';
import BluetoothHandler from '../helpers/bluetoothHandler';


const BluetoothContext = createContext(null);

function BluetoothWrapper({ children }) {

    const {initConnection, bleDevice, readFromDevice, writeToDevice, status:blStatus, readStatus} = BluetoothHandler();
    
    const BTcontext = {initConnection, bleDevice, readFromDevice, writeToDevice, blStatus, readStatus};
    
    return (
        <section className="section">
        <BluetoothContext.Provider value={{BTcontext}}>
            {children}
        </BluetoothContext.Provider>
        </section>
    );
}

export {BluetoothWrapper, BluetoothContext}