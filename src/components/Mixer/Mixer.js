import React, { useContext } from "react";
import { observer } from "mobx-react";
import AudioContext from "../../stores/audioManager";

import "./Mixer.css";

function Mixer() {
  const audioManager = useContext(AudioContext);

  const handleSetVolume = (key, e) => {
    audioManager.setVolumeChannel(key, e.target.value);
  };

  const handleSetMasterVolume = e => {
    audioManager.setMasterVolume(e.target.value);
  };

  const handleSetReverbVolume = e => {
    audioManager.setReverbVolume(e.target.value);
  };

  const handleClickReverb = key => {
    audioManager.connectChannelToReverb(key);
  };

  return (
    <div className='mixer'>
      <h2 className='mixer__title'>mixer</h2>
      <div className='mixer__channels'>
        {audioManager.sampleKeys.map(key => (
          <div className='channel' key={key}>
            <div className='channel__fader-wrapper'>
              <div className='channel__fader-wrapper__fader'>
                <input
                  className='channel__fader'
                  type='range'
                  min='0.01'
                  max='1'
                  step='0.01'
                  name={key}
                  key={key}
                  value={audioManager.getChannelVolume(key)}
                  onChange={e => handleSetVolume(key, e)}
                />
              </div>
            </div>
            <div className='channel__volume-wrapper'>
              <label className='channel__volume'>
                {audioManager.getChannelVolume(key)}
              </label>
            </div>
            <div>
              <label htmlFor='rev'>Reverb</label>
              <input
                type='checkbox'
                id='rev'
                checked={audioManager.getchannelReverbStatus(key)}
                onChange={() => handleClickReverb(key)}
              />
            </div>
          </div>
        ))}
        <div className='channel'>
          <div className='channel__fader-wrapper'>
            <div className='channel__fader-wrapper__fader'>
              <input
                className='channel__fader'
                type='range'
                min='0.01'
                max='1'
                step='0.01'
                name='master-volume'
                value={audioManager.getMasterVolume()}
                onChange={handleSetMasterVolume}
              />
            </div>
          </div>
          <div className='channel__volume-wrapper'>
            <label className='channel__volume'>
              Master {audioManager.getMasterVolume()}
            </label>
          </div>
        </div>
        
        <div className='channel'>
          <div className='channel__fader-wrapper'>
            <div className='channel__fader-wrapper__fader'>
              <input
                className='channel__fader'
                type='range'
                min='0.01'
                max='1'
                step='0.01'
                name='master-volume'
                value={audioManager.getReverbVolume()}
                onChange={handleSetReverbVolume}
              />
            </div>
          </div>
          <div className='channel__volume-wrapper'>
            <label className='channel__volume'>
              Reverb {audioManager.getReverbVolume()}
            </label>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default observer(Mixer);
