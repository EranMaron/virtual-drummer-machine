import React from "react";

import Drums from "../../components/Drums/Drums";
import Mixer from "../../components/Mixer/Mixer";

import "./Playground.css";

function Playground() {
  return (
    <div className='playground'>
      <Drums />
      <Mixer />
    </div>
  );
}

export default Playground;
