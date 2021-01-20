import React, { useContext } from "react";
import { observer } from "mobx-react";
import AudioContext from "../../stores/audioManager";

function Mixer() {
  const audioManager = useContext(AudioContext);

  const handleSetVolume = (key, e) => {
    audioManager.setVolumeChannel(key, e.target.value);
  };
  return (
    <div className='mixer'>
      <h2 className='mixer__title'>mixer</h2>
      {audioManager.getSamplesKeys.map(key => (
        <>
          <input
            defaultValue={audioManager.getInitialVolume}
            className='mixer__fader'
            type='range'
            min='0'
            max='100'
            step='0.1'
            name={key}
            key={key}
            onChange={e => handleSetVolume(key, e)}
          />
          <h3>{audioManager.getChannelVolume(key)}</h3>
        </>
      ))}
    </div>
  );
}

export default observer(Mixer);
