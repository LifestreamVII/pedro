import React from 'react'
import { useState, useEffect, useContext } from "react";
import { BluetoothContext } from "../components/BluetoothWrapper";
import { useNavigate } from "react-router-dom";
import { jsonrepair } from 'jsonrepair'


function SaveExtraction() {

    const { BTcontext } = useContext(BluetoothContext);
    const { bleDevice, blStatus, readFromDevice, writeToDevice, readStatus } = BTcontext;
    const [noBl, setNoBl] = useState(false);
    const [complete, setComplete] = useState(0);
    const [pending, setPending] = useState(false);
    const [trainer, setTrainer] = useState({});
    const [boxes, setBoxes] = useState([]);
    const [skipExtr, setSkipExtr] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (noBl)
          return navigate("/btpair");
        if (blStatus.includes("DONE") || blStatus.includes("100") || skipExtr)
            {
                setComplete(1);
                setPending(false);
            }
            
        if (!pending && complete == 1){
            setPending(true);
            decode();
        }
        if (!pending 
            && blStatus.includes("DONE")
             && complete == 2){
            setPending(true);
            readDecrypted();
        }
        if (complete == 3 && typeof trainer == "object"){
            console.log(trainer);
            console.log(boxes[0]);
            return navigate("/home");
        }
    }, [noBl, blStatus, complete, trainer, boxes]);

    const extract = async () => {
        // setPending(false);
        // setComplete(2);
        // return true;
        if (true) {
        if (!bleDevice) {
            console.log("no bl device");
            setNoBl(true);
            return null;
        }
    
        let data = "CMD:RSAV()";
    
        await writeToDevice(bleDevice, data);
    
        const result = await readFromDevice(bleDevice);

        if (result && result == "RSAV_OK") {
            
        } else {
          // throw err;
        }}
    }

    const decode = async () => 
    {
        setPending(true);
        if (!bleDevice) {
            console.log("no bl device");
            setNoBl(true);
            return null;
        }

        let data = "CMD:DSAV()";
    
        await writeToDevice(bleDevice, data);
    
        const result = await readFromDevice(bleDevice);

        if (result && result == "DSAV_OK") {

            setPending(false);
            setComplete(2);
            
        } else {
          // throw err;
        }
    }

    class JSONParser {
    constructor() {
        this.buffer = '';
        this.result = {};
    }

    // Method to process each chunk
    processChunk(chunk) {
        this.buffer += chunk; // Append the new chunk to the buffer

        let jsonStart = this.buffer.indexOf('{');
        let jsonEnd = this.buffer.lastIndexOf('}');

        // Only parse if there's a complete JSON object in the buffer
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            let validJsonPart = this.buffer.substring(jsonStart, jsonEnd + 1);

            try {
                // Parse the valid JSON part
                let parsedObject = JSON.parse(validJsonPart);

                // Add the parsed key/value pairs to the result object
                Object.assign(this.result, parsedObject);

                // Update the buffer to remove the processed part
                this.buffer = this.buffer.substring(jsonEnd + 1);
            } catch (error) {
                // Handle JSON parse errors if any
                console.error('Error parsing JSON:', error);
            }
        }
    }

    
    // Method to get the final result
    getResult() {
        return this.result;
    }
}
    
    const readDecrypted = async () => {
        
        let data = `CMD:RDEC(TRAINER)`;
    
        await writeToDevice(bleDevice, data);
    
        let boxes = [];

        let parser = new JSONParser();

        let counter = 1;

        const trainer = await readFromDevice(bleDevice);

        if (trainer && trainer.length) {
                
                parser.processChunk(trainer);

                let tr = parser.getResult();

                localStorage.setItem('trainerdata', JSON.stringify(tr));
                
                while (counter < 6){
                    
                    let data = `CMD:RDEC(BOX${counter})`;
                    
                    await writeToDevice(bleDevice, data);
                    
                    const box = await readFromDevice(bleDevice);
                    
                    if (box && box.length){
                        parser.processChunk(box);
                        let bx = parser.getResult();
                        boxes.push(bx);
                    }
                    counter++
                }

                localStorage.setItem('boxes', boxes);
                setBoxes(boxes);
                setComplete(3);
        }
    }

  return (
    <div>
        <button onClick={extract}>Begin Extraction</button>
        <p>{complete}</p>
    </div>
  )
}

export default SaveExtraction