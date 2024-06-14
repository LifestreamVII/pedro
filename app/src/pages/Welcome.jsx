import React from 'react'
import { Link } from "react-router-dom";

function Welcome() {
  return (
    <div>
        <h1>Welcome to Pedro</h1>
        <p>Screen showing when no save data is loaded</p>

        <Link to="/gamescan">Click to begin extraction (pairing might occur first)</Link>
    </div>
  )
}

export default Welcome