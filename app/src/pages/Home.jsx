import {React, useState, useEffect} from 'react'

const Home = () => {

    const [noDB, setNoDB] = useState(false);
    const [trainer, setTrainer] = useState(false);
    const [boxes, setBoxes] = useState(false);


    const getStorage = () => {
        const tr = localStorage.getItem("trainerdata");
        const bx = localStorage.getItem("boxes");

        if (tr && bx) {
            setTrainer(JSON.parse(tr));
            setBoxes(bx);
        }
 
        if (!tr && !bx)
            setNoDB(true);
    }

    useEffect(() => {
        getStorage();
    
        if (noDB)
          return navigate("/btpair");
    
      }, [noDB]);
  
    return (
    <div>

        <p>Trainer Information</p>
        {
            trainer ? (
                <div>
                    <p>{trainer.Name}</p>
                    <p>{trainer.Sex}</p>
                    <p>{trainer.PlayTime}</p>
                    <p>{trainer.Generation}</p>
                </div>
            ) : ("")
        }

    </div>
  )
}

export default Home