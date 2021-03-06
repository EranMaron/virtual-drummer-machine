import React, { useContext } from "react";
import AudioContext from "../../stores/audioManager";

function InitialPage({ initial }) {
  const audioContext = useContext(AudioContext);
  const handleInitial = () => {
    audioContext.initializeAudio();
    initial(true);
  };

  return (
    <div>
      <h1>Initial Page</h1>
      <button onClick={handleInitial}>Let's go!</button>
    </div>
  );
}

export default InitialPage;
