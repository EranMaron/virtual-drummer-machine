import { makeObservable, observable, action, computed } from "mobx";
import { createContext } from "react";
import sounds from "../sounds";
import images from "../drumsImages";
// import crowdSound from "../assets/samples/crowd.mp3";

class AudioManager {
  drumKit = "Drum Kit 1";
  impulseReverb = "";
  channelsStrip = {};
  masterVolumeBus = {};
  masterVolume = {};

  static samples = sounds;
  static initialVolume = 80;
  static images = images;

  constructor() {
    this.ctx = new AudioContext();
    this.masterOut = this.ctx.destination;
    this.masterVolumeBus = this.ctx.createChannelMerger(6);
    this.masterVolume.volume = this.constructor.initialVolume;
    this.masterVolume.gainNode = this.ctx.createGain();

    this.setDrumKit(this.drumKit);

    makeObservable(this, {
      drumKit: observable,
      masterVolume: observable,
      setDrumKit: action,
      setReverbEffect: action,
      setVolumeChannel: action,
      setMasterVolume: action,
      sampleKeys: computed,
      drumKits: computed,
      drumImages: computed,
    });
  }

  initializeAudio() {
    this.ctx.resume();
    window.addEventListener("keydown", e => this.playSound(e.code));
    // fetch(crowdSound)
    //   .then(response => response.arrayBuffer())
    //   .then(arrayBuffer => this.ctx.decodeAudioData(arrayBuffer))
    //   .then(audioBuffer => {
    //     const audio = this.ctx.createBufferSource();
    //     audio.buffer = audioBuffer;
    //     audio.connect(this.ctx.destination);
    //     audio.currentTime = 0.5;
    //     audio.start();
    //   });
  }

  // setMasterGroups() {
  //   const {
  //     masterGroups,
  //     constructor: { initialVolume },
  //   } = this;
  //   masterGroups = observable({ volume: initialVolume });
  //   masterGroups.volumeBus = this.ctx.createChannelMerger(6);
  //   masterGroups.volumeBus.connect(this.masterOut);
  // }

  setDrumKit(kit) {
    this.channelsStrip = {};
    const {
      channelsStrip,
      constructor: { initialVolume },
    } = this;
    if (!(kit in this.constructor.samples))
      throw Error(`Kit "${kit}" was not found`);

    this.drumKit = kit;
    this.sampleKeys.forEach(async channel => {
      channelsStrip[channel] = observable({
        volume: initialVolume,
      });
      let buffer = await this.getBuffer(channel);
      channelsStrip[channel].audio = buffer;
      channelsStrip[channel].gain = this.ctx.createGain();
    });
  }

  async getBuffer(channel) {
    const response = await fetch(
      this.constructor.samples[this.drumKit][channel].default,
    );
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await this.ctx.decodeAudioData(arrayBuffer);
    return buffer;
  }

  setReverbEffect(impulse) {
    console.log("Set Reverb Effect");
  }

  setMasterVolume(value) {
    this.masterVolume.volume = value;
    this.masterVolume.gainNode.gain.setValueAtTime(
      value / 100,
      this.ctx.currentTime,
    );
  }

  setVolumeChannel(channel, value) {
    console.log(value / 100);
    this.channelsStrip[channel].volume = value;
    this.channelsStrip[channel].gain.gain.setValueAtTime(
      value / 100,
      this.ctx.currentTime,
    );
  }

  getMasterVolume() {
    console.log(this.masterVolume.volume);
    return this.masterVolume.volume;
  }

  getChannelVolume(channel) {
    if (channel) return this.channelsStrip[channel].volume;
  }

  get sampleKeys() {
    return Object.keys(this.constructor.samples[this.drumKit] || {});
  }

  get drumImages() {
    return this.constructor.images[this.drumKit].default;
  }

  get drumKits() {
    return Object.keys(this.constructor.samples || {});
  }

  playSound(key) {
    const { masterOut, masterVolume, masterVolumeBus, channelsStrip } = this;
    if (!channelsStrip[key]) return;

    const audio = this.ctx.createBufferSource();
    audio.buffer = channelsStrip[key].audio;
    audio.connect(channelsStrip[key].gain);
    channelsStrip[key].gain.connect(masterVolumeBus);
    masterVolumeBus.connect(masterVolume.gainNode);
    masterVolume.gainNode.connect(masterOut);
    audio.start();
  }
}

export default createContext(new AudioManager());
