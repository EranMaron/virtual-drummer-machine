import { makeObservable, observable, action, computed } from "mobx";
import { createContext } from "react";
import sounds from "../sounds";
import impulses from "../reverbs";
import images from "../drumsImages";
import crowdSound from "../assets/samples/crowd.mp3";

class AudioManager {
  drumKit = "Drum Kit 1";
  channelsStrip = {};
  masterVolumeBus = {};
  masterVolume = {};
  masterReverbBus = {};
  masterReverbVolume = {};
  masterReverb = {};
  impulseReverb = "Greek 7 Echo Hall";

  static samples = sounds;
  static effects = impulses;
  static images = images;
  static initialVolume = 80;

  constructor() {
    this.ctx = new AudioContext();
    this.masterOut = this.ctx.destination;
    this.effects = impulses;

    this.setMasterChnnel();
    this.setReverbEffect(this.impulseReverb);
    this.setDrumKit(this.drumKit);

    makeObservable(this, {
      drumKit: observable,
      masterVolume: observable,
      masterReverbVolume: observable,
      impulseReverb: observable,
      setDrumKit: action,
      setReverbEffect: action,
      setVolumeChannel: action,
      setMasterVolume: action,
      setReverbVolume: action,
      connectChannelToReverb: action,
      sampleKeys: computed,
      drumKits: computed,
      drumImages: computed,
    });
  }

  initializeAudio() {
    if (this.ctx.state === "suspended") this.ctx.resume();

    window.addEventListener("keydown", e => this.playSound(e.code));
    fetch(crowdSound)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => this.ctx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        const audio = this.ctx.createBufferSource();
        audio.buffer = audioBuffer;
        audio.connect(this.ctx.destination);
        audio.currentTime = 0.5;
        audio.start();
      });
  }

  setMasterChnnel() {
    this.masterVolumeBus = this.ctx.createChannelMerger(6);
    this.masterVolume.volume = this.constructor.initialVolume;
    this.masterVolume.gainNode = this.ctx.createGain();
    this.masterVolumeBus.connect(this.masterVolume.gainNode);
    this.masterVolume.gainNode.connect(this.masterOut);
  }

  async setReverbEffect() {
    this.masterReverbBus = this.ctx.createChannelMerger(6);
    this.masterReverbVolume.volume = this.constructor.initialVolume;
    this.masterReverbVolume.gainNode = this.ctx.createGain();
    this.masterReverb = this.ctx.createConvolver();

    if (this.impulseReverb === "None") return;
    this.masterReverb.buffer = await this.getBuffer(
      this.effects[this.impulseReverb].default,
    );

    this.masterReverbBus.connect(this.masterReverb);
    this.masterReverb.connect(this.masterReverbVolume.gainNode);
    this.masterReverbVolume.gainNode.connect(this.masterOut);
  }

  connectChannelToReverb(key) {
    this.channelsStrip[key].reverb
      ? this.channelsStrip[key].gain.disconnect(this.masterReverbBus)
      : this.channelsStrip[key].gain.connect(this.masterReverbBus);

    this.channelsStrip[key].reverb = !this.channelsStrip[key].reverb;
  }

  setDrumKit(kit) {
    // this.channelsStrip = {};
    const {
      channelsStrip,
      masterVolumeBus,
      constructor: { initialVolume },
    } = this;
    if (!(kit in this.constructor.samples))
      throw Error(`Kit "${kit}" was not found`);

    this.drumKit = kit;
    this.sampleKeys.forEach(async channel => {
      channelsStrip[channel] = observable({
        volume: initialVolume,
        reverb: false,
      });
      let buffer = await this.getBuffer(
        this.constructor.samples[this.drumKit][channel].default,
      );
      channelsStrip[channel].audio = buffer;
      channelsStrip[channel].gain = this.ctx.createGain();
      channelsStrip[channel].gain.connect(masterVolumeBus);
    });
  }

  async getBuffer(path) {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = await this.ctx.decodeAudioData(arrayBuffer);
    return buffer;
  }

  setMasterVolume(value) {
    this.masterVolume.volume = parseFloat(value);
    this.masterVolume.gainNode.gain.exponentialRampToValueAtTime(
      parseFloat(value),
      this.ctx.currentTime + 0.012,
    );
  }

  setReverbVolume(value) {
    this.masterReverbVolume.volume = parseFloat(value);
    this.masterReverbVolume.gainNode.gain.exponentialRampToValueAtTime(
      parseFloat(value),
      this.ctx.currentTime + 0.012,
    );
  }

  setVolumeChannel(channel, value) {
    this.channelsStrip[channel].volume = parseFloat(value);
    this.channelsStrip[channel].gain.gain.exponentialRampToValueAtTime(
      parseFloat(value),
      this.ctx.currentTime + 0.012,
    );
  }

  getMasterVolume() {
    return this.masterVolume.volume;
  }

  getReverbVolume() {
    console.log(this.masterReverbVolume.volume);
    return this.masterReverbVolume.volume;
  }

  getChannelVolume(channel) {
    if (channel) return this.channelsStrip[channel].volume;
  }

  getchannelReverbStatus(channel) {
    return this.channelsStrip[channel].reverb;
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
    const { channelsStrip } = this;
    if (!channelsStrip[key]) return;
    const audio = this.ctx.createBufferSource();
    audio.buffer = channelsStrip[key].audio;
    audio.connect(channelsStrip[key].gain);

    audio.start();
  }
}

export default createContext(new AudioManager());
