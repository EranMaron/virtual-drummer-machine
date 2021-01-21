import React, { useContext, useRef } from "react";
import AudioManager from "../../stores/audioManager";

import Drums from "../../components/Drums/Drums";
import Mixer from "../../components/Mixer/Mixer";

function Playground() {
  const kitSelectRef = useRef(null);

  const audioManager = useContext(AudioManager);

  const handleChangeKit = e => {
    audioManager.setDrumKit(e.target.value);
    kitSelectRef.current.blur();
  };

  return (
    <div>
      <select
        name='drumKit'
        onChange={handleChangeKit}
        ref={ref => (kitSelectRef.current = ref)}
      >
        {audioManager.drumKits.map(kit => (
          <option value={kit} key={kit}>
            {kit}
          </option>
        ))}
      </select>
      <Drums />
      <Mixer />
    </div>
  );
}

export default Playground;
