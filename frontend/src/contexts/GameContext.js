import React, { createContext, useState, useEffect } from 'react';

const GameContext = createContext();

// create provider
const GameContextProvider = ({ children }) => {
  // const [stage, setStage] = useState('waiting');
  const [videoSession, setVideoSession] = useState(null);

  const startSession = () => {};
  return (
    <GameContext.Provider
      value={{
        videoSession,
        startSession,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameContextProvider };
