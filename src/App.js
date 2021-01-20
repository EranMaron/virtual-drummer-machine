import React, { useState } from "react";
import InitialPage from "./components/InitialPage/InitialPage";
import Playground from "./components/Playground/Playground";

import "./App.css";

function App() {
  const [isInitialized, setIsinitialized] = useState(false);

  return (
    <div className='App'>
      {!isInitialized ? (
        <InitialPage initial={setIsinitialized} />
      ) : (
        <Playground />
      )}
    </div>
  );
}

export default App;
