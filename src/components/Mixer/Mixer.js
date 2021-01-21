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
      {audioManager.sampleKeys.map(key => (
        <React.Fragment key={key}>
          <input
            // defaultValue={audioManager.initialVolume}
            className='mixer__fader'
            type='range'
            min='0'
            max='100'
            step='0.1'
            name={key}
            key={key}
            value={audioManager.getChannelVolume(key)}
            onChange={e => handleSetVolume(key, e)}
          />
          <h3>{audioManager.getChannelVolume(key)}</h3>
        </React.Fragment>
      ))}
    </div>
  );
}

export default observer(Mixer);
