import { makeObservable, observable, action, computed } from "mobx";
import { createContext } from "react";
import sounds from "../sounds";

class AudioManager {
  drumKit = "kitOne";
  channelsStrip = {};

  static samples = sounds;
  static initialVolume = 80;

  constructor() {
    this.ctx = new AudioContext();
    this.setDrumKit(this.drumKit);

    makeObservable(this, {
      drumKit: observable,
      setDrumKit: action,
      setReverbEffct: action,
      setVolumeChannel: action,
      sampleKeys: computed,
      drumKits: computed,
      initialVolume: computed,
    });
  }

  initializeAudio() {
    this.ctx.resume();
    window.addEventListener("keydown", e => this.playSound(e.code));
  }

  setDrumKit(kit) {
    console.log("Set Drum Kit to ", kit);
    this.channelsStrip = {};
    const {
      channelsStrip,
      constructor: { samples, initialVolume },
    } = this;
    if (!(kit in this.constructor.samples))
      throw Error(`Kit "${kit}" was not found`);

    this.drumKit = kit;
    this.sampleKeys.map(channel => {
      channelsStrip[channel] = observable({
        volume: initialVolume,
      });
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
    this.channelsStrip[channel].volume = value;
    this.channelsStrip[channel].gain.gain.setValueAtTime(
      value / 100,
      this.ctx.currentTime,
    );
  }

  getChannelVolume(channel) {
    return this.channelsStrip[channel].volume;
  }

  get sampleKeys() {
    return Object.keys(this.constructor.samples[this.drumKit] || {});
  }

  get drumKits() {
    return Object.keys(this.constructor.samples || {});
  }

  get initialVolume() {
    return this.constructor.initialVolume;
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
