import React, { useContext, useEffect } from "react";
import AudioManager from "../../stores/audioManager";

import Drums from "../../components/Drums/Drums";
import Mixer from "../../components/Mixer/Mixer";

function Playground() {
  const audioManager = useContext(AudioManager);

  useEffect(() => {
    audioManager.setDrumKit();
  }, []);

  const handleChangeKit = e => {
    audioManager.setDrumKit(e.target.value);
  };

  return (
    <div>
      <select name='drumKit' onChange={handleChangeKit}>
        {audioManager.getDrumKits.map(kit => (
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
