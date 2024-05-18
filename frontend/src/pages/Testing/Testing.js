import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { AccountContext, UserContext } from '../../contexts';

const Testing = () => {
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [currentMission, setCurrentMission] = useState('');
  const { challengeId } = useContext(UserContext);
  const { userId } = useContext(AccountContext);
  const [scores, setScores] = useState([]);
  const [rankings, setRankings] = useState([]);
  const navigate = useNavigate();
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:5001', {
      query: { userId },
      transports: ['websocket'],
      cors: {
        origin: '*',
      },
    });

    socket.current.on('connect', () => {
      console.log('Connected to server');
      socket.current.emit('JOIN_ROOM', { challengeId, userId });
    });

    socket.current.on('ROOM_STATUS', data => {
      console.log('Room status');
      console.log(data);
    });

    socket.current.on('ALL_LOADED', () => {
      setIsAllLoaded(true);
    });

    socket.current.on('MISSION_STATE', data => {
      console.log('Mission state:', data);
      setCurrentMission(data.mission);
    });

    socket.current.on('MISSION_COMPLETE', () => {
      alert('All missions completed!');
      socket.current.emit('GET_RANKINGS', { challengeId });
    });

    socket.current.on('UPDATE_SCORES', data => {
      setScores(prevScores => [
        ...prevScores,
        { userId: data.userId, score: data.score },
      ]);
    });

    socket.current.on('RAKINGS', data => {
      setRankings(data);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [challengeId, userId]);

  useEffect(() => {
    if (isAllLoaded) {
      navigate('/game');
    }
  }, [isAllLoaded, navigate]);

  const startMission = () => {
    console.log('Starting mission');
    console.log('Client ID:', socket.current.id);
    socket.current.emit('START_MISSION', { challengeId });
  };

  const mediaPipeLodingTrue = () => {
    console.log('MediaPipe loading complete');
    setIsMediaPipeLoaded(true);
    console.log('Client ID:', socket.current.id);
    socket.current.emit('SET_LOADING_STATUS', {
      challengeId,
      status: true,
      userId,
    });
  };

  const completeMission = score => {
    console.log('Completing mission');
    console.log('Client ID:', socket.current.id);
    socket.current.emit('COMPLETE_MISSION', { challengeId, score, userId });
  };

  const reconnect = () => {
    console.log('Reconnecting');
    console.log('Client ID:', socket.current.id);
    socket.current.emit('RECONNECT', { challengeId, userId });
  };

  return (
    <Wrapper>
      <LoadingMessage>
        {isMediaPipeLoaded ? 'MediaPipe 로딩 완료!' : 'MediaPipe 로딩 중...'}
      </LoadingMessage>
      <MediaLoading onClick={mediaPipeLodingTrue} />
      <StartButton disabled={!isAllLoaded}>
        {isAllLoaded ? '게임 시작' : '다른 플레이어 로딩 중...'}
      </StartButton>
      <MissionControl>
        <button onClick={startMission}>Start Mission</button>
        <button onClick={() => completeMission(100)}>
          Complete Mission with 100 points
        </button>
        <p>Current Mission: {currentMission}</p>
        <button onClick={reconnect}>Reconnect</button>
        <p>
          Scores:{' '}
          {scores.map(score => `${score.userId}: ${score.score}`).join(', ')}
        </p>
        <h2>Rankings</h2>
        <ul>
          {rankings.map((ranking, index) => (
            <li key={index}>
              {ranking[0]}: {ranking[1]}
            </li>
          ))}
        </ul>
      </MissionControl>
    </Wrapper>
  );
};

export default Testing;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const LoadingMessage = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const StartButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${props => (props.disabled ? '#ccc' : '#4CAF50')};
  color: white;
  border: none;
  border-radius: 5px;
  &:disabled {
    cursor: not-allowed;
  }
`;

const MediaLoading = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${props => (props.disabled ? '#ccc' : '#4CAF50')};
  color: white;
  border: none;
  border-radius: 5px;
  &:disabled {
    cursor: not-allowed;
  }
`;

const MissionControl = styled.div`
  margin-top: 20px;
`;
