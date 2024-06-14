import React from 'react'
import { useEffect, useContext } from "react";
import { BluetoothContext } from "../components/BluetoothWrapper";
import {useNavigate} from 'react-router-dom';

function Pairing() {
    const { BTcontext } = useContext(BluetoothContext);
    const { initConnection, bleDevice, blStatus } = BTcontext;
    const navigate = useNavigate();

    useEffect(()=>{
        initConnection();
        console.log(bleDevice);
        if (bleDevice && blStatus.includes("connected"))
            {
                return navigate("/")
            }
    },[bleDevice])

  return (
    <div>
        <p>Pairing screen</p>
    </div>
  )
}

export default Pairing