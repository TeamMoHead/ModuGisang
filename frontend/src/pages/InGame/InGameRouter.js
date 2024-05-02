import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GameContext } from '../../contexts/GameContext';
import InGame from './InGame';

function InGameRouter() {
  // const { inGameMode } = useContext(GameContext);

  return (
    <Routes>
      <Route path="/waiting" element={<InGame />} />
      <Route path="/mission1" element={<InGame />} />
      <Route path="/mission2" element={<InGame />} />
      <Route path="/mission3" element={<InGame />} />
      <Route path="/mission4" element={<InGame />} />
      <Route path="/affirmation" element={<InGame />} />
      <Route path="/result" element={<InGame />} />
    </Routes>
  );
}

export default InGameRouter;
