import React, { useRef, useContext } from "react";
import AudioManager from "../../stores/audioManager";
import "./Drums.css";

function Drums() {
  const kitSelectRef = useRef(null);
  const audioManager = useContext(AudioManager);

  const handleChangeKit = e => {
    audioManager.setDrumKit(e.target.value);
    kitSelectRef.current.blur();
  };

  return (
    <div className='drums'>
      <h2 className='drums__title'>Drums</h2>
      <select
        className='drums__kit-select'
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
    </div>
  );
}

export default Drums;
