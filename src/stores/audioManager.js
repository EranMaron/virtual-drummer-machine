import { makeAutoObservable, observable, action, computed } from "mobx";
import { createContext } from "react";
import sounds from "../sounds";
class AudioManager {
  drumKit = "kitOne";
  channelsStrip = {};

  static samples = sounds;
  static initialVolume = 80;

  constructor() {
    this.ctx = new AudioContext();

    makeAutoObservable(this, {
      drumKit: observable,
      setDrumKit: action,
      setReverbEffct: action,
      setVolumeChannel: action,
      getSamplesKeys: computed,
      getDrumKits: computed,
      getInitialVolume: computed,
    });
  }

  initializeAudio() {
    this.ctx.resume();
    window.addEventListener("keydown", e => this.playSound(e.code));
  }

  setDrumKit(kit = "kitOne") {
    console.log("Set Drum Kit to ", kit);
    const {
      channelsStrip,
      constructor: { samples, initialVolume },
    } = this;
    if (!(kit in this.constructor.samples))
      throw Error(`Kit "${kit}" was not found`);

    this.drumKit = kit;
    this.getSamplesKeys.map(channel => {
      channelsStrip[channel] = {
        volume: observable(initialVolume),
      };
      fetch(samples[this.drumKit][channel].default)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => this.ctx.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          channelsStrip[channel].audio = audioBuffer;
          channelsStrip[channel].gain = this.ctx.createGain();
        });
    });
  }

  setReverbEffct(impulse) {
    console.log("Set Reverb Effect");
  }

  setVolumeChannel(channel, value) {
    // console.log("Change Volume Channel", channel, value);
    this.channelsStrip[channel].volume = value;
    console.log(this.channelsStrip[channel].volume);
  }

  get getSamplesKeys() {
    return Object.keys(this.constructor.samples[this.drumKit] || {});
  }

  get getDrumKits() {
    return Object.keys(this.constructor.samples || {});
  }

  get getInitialVolume() {
    return this.constructor.initialVolume;
  }

  getChannelVolume(channel) {
    return this.channelsStrip[channel]?.volume;
  }

  playSound(key) {
    const { channelsStrip } = this;
    if (!channelsStrip[key]) return;
    const audio = this.ctx.createBufferSource();
    audio.buffer = channelsStrip[key].audio;
    audio.connect(channelsStrip[key].gain);
    channelsStrip[key].gain.connect(this.ctx.destination);
    audio.start();
  }
}

export default createContext(new AudioManager());
