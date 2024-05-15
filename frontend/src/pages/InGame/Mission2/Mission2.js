import React, { useEffect, useContext, useState } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import { MissionStarting, MissionEnding } from '../components';
import styled, { keyframes } from 'styled-components';
import stickyNoteImage from '../../../assets/sticky_note.png';
import { RoundSoundEffect, MissionSoundEffects } from '../Sound';

let topScore = 0;
let leftScore = 0;
let rightScore = 0;
let targetNumber = 10;
let prevTopEyebrow = null;
let prevLeftCheek = null;
let prevRightCheek = null;
let prevJawPosition = null;
let isMovingScore = 0;
let isMovingStatus = true; // 움직이는 중인지 여부
let myPostitStatus = [false, false, false]; // 측정 결과
const timeoutDuration = 15000; // 제한 시간
let isTimeOut = false; // 타임 아웃 여부
let isGameStart = false;

const Mission2 = () => {
  const [postitPositions, setPostitPositions] = useState([
    {
      // 이마
      top: 0, // y 좌표
      left: 0, // x 좌표
      size: 0, // width, height
      imageUrl: stickyNoteImage,
      shouldFall: false, // 포스트잇이 떨어졌는지 여부
      scorePoint: 9, // 더할 점수. 이마는 상대적으로 떼기 어려워서 추가 점수 있음
    },
    {
      // 왼쪽 볼
      top: 0,
      left: 0,
      size: 0,
      imageUrl: stickyNoteImage,
      shouldFall: false,
      scorePoint: 8,
    },
    {
      // 오른쪽 볼
      top: 0,
      left: 0,
      size: 0,
      imageUrl: stickyNoteImage,
      shouldFall: false,
      scorePoint: 8,
    },
  ]); // 포스트잇의 정보

  const { holisticModel, setIsHolisticLoaded, setIsHolisticInitialized } =
    useContext(MediaPipeContext);
  const {
    isMissionStarting,
    isMissionEnding,
    inGameMode,
    isRoundPassed,
    myMissionStatus,
    setMyMissionStatus,
    setGameScore,
    setIsRoundPassed,
  } = useContext(GameContext);
  const { myVideoRef } = useContext(OpenViduContext);

  const image = new Image();
  image.src = stickyNoteImage;

  const postitGame = faceLandmarks => {
    if (!faceLandmarks) return;

    const jawIndex = 152;
    const jaw = faceLandmarks[jawIndex];
    if (prevJawPosition) {
      const deltaJawX = Math.abs(jaw.x - prevJawPosition.x);
      const deltaJawY = Math.abs(jaw.y - prevJawPosition.y);

      // 윗 입술 높이와 비례해서 움직임 판정
      const heightLip =
        Math.abs(faceLandmarks[0].y - faceLandmarks[12].y) * 1.5;

      // 입꼬리를 움직일 때 턱도 움직이게 되어 있어서 움직임 판단 기준을 상대적으로 높임
      if (deltaJawX + deltaJawY > heightLip) {
        isMovingStatus = true;
        isMovingScore = 0;
        console.log('----- 움직이는 중');
      } else {
        isMovingScore += 1;

        if (isMovingScore > 10) {
          isMovingStatus = false;
        }
      }

      const topEyebrow = faceLandmarks[107]; // 눈썹
      const leftCheek = faceLandmarks[61]; // 왼쪽 볼
      const rightCheek = faceLandmarks[291]; // 오른쪽 볼

      if (!isMovingStatus) {
        // 눈썹 움직임 확인
        if (topScore < targetNumber && !myPostitStatus[0]) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevTopEyebrow) {
            const deltaTopY = Math.abs(topEyebrow.y - prevTopEyebrow.y);
            if (deltaTopY > heightLip * 0.7) {
              topScore += 1;
              console.log('----- topScore:', topScore);

              if (topScore >= targetNumber) {
                myPostitStatus[0] = true;
              }
            }
          }
        }

        // 좌측 볼 움직임 확인
        if (leftScore < targetNumber && !myPostitStatus[1]) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevLeftCheek) {
            const deltaLeftX = Math.abs(leftCheek.x - prevLeftCheek.x);
            const deltaLeftY = Math.abs(leftCheek.y - prevLeftCheek.y);
            if (deltaLeftY + deltaLeftX > heightLip) {
              leftScore += 1;
              console.log('----- leftScore:', leftScore);

              if (leftScore >= targetNumber) {
                myPostitStatus[1] = true;
              }
            }
          }
        }

        // 우측 볼 움직임 확인
        if (rightScore < targetNumber && !myPostitStatus[2]) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevRightCheek) {
            const deltaRightX = Math.abs(rightCheek.x - prevRightCheek.x);
            const deltaRightY = Math.abs(rightCheek.y - prevRightCheek.y);
            if (deltaRightX + deltaRightY > heightLip) {
              rightScore += 1;
              console.log('----- rightScore:', rightScore);

              if (rightScore >= targetNumber) {
                myPostitStatus[2] = true;
              }
            }
          }
        }
      }
      prevTopEyebrow = { x: topEyebrow.x, y: topEyebrow.y }; // 이전 눈썹 위치 갱신
      prevLeftCheek = { x: leftCheek.x, y: leftCheek.y }; // 이전 좌측 볼의 좌표 갱신
      prevRightCheek = { x: rightCheek.x, y: rightCheek.y }; // 이전 우측 볼의 좌표 갱신
    }
    prevJawPosition = { x: jaw.x, y: jaw.y };

    if (
      !isTimeOut &&
      myPostitStatus.every(status => status === true) &&
      myPostitStatus.every(shouldFall => shouldFall === true)
    ) {
      setMyMissionStatus(true);
      setIsRoundPassed(false);
    }
    if (faceLandmarks && !myMissionStatus) {
      myPostitStatus?.forEach((status, index) => {
        if (!status) {
          const newPostitPosition = calculatePostitPosition(
            faceLandmarks,
            index === 0 ? 107 : index === 1 ? 205 : 425, // 각 포스트잇의 위치 계산(0: 이마, 1: 왼쪽 볼, 2: 오른쪽 볼)
          );
          setPostitPositions(prevPositions => {
            const updatedPositions = [...prevPositions];
            updatedPositions[index] = {
              ...updatedPositions[index],
              ...newPostitPosition,
            };
            return updatedPositions;
          });
        } else if (!isTimeOut) {
          setPostitPositions(prevPositions => {
            const updatedPositions = [...prevPositions];

            // 점수 갱신
            if (!updatedPositions[index].shouldFall) {
              setGameScore(
                prevScore => prevScore + updatedPositions[index].scorePoint,
              );
              // 포스트잇 떨어지도록 인자 변경
              updatedPositions[index] = {
                ...prevPositions[index],
                shouldFall: true,
              };
              setIsRoundPassed(true);
              setTimeout(() => setIsRoundPassed(false), 500);
            }
            return updatedPositions;
          });
        }
      });
    }
  };

  useEffect(() => {
    if (
      inGameMode !== 2 ||
      !myVideoRef.current ||
      !holisticModel.current ||
      isMissionStarting
    ) {
      return;
    }

    const handleTimeout = () => {
      isTimeOut = true;
    };

    if (!isGameStart) {
      isGameStart = true;
      setTimeout(handleTimeout, timeoutDuration);
    }

    const videoElement = myVideoRef.current;

    holisticModel.current.onResults(results => {
      if (results.faceLandmarks) {
        postitGame(results.faceLandmarks);
      }
    });

    const handleCanPlay = () => {
      if (holisticModel.current !== null) {
        holisticModel.current.send({ image: videoElement }).then(() => {
          requestAnimationFrame(handleCanPlay);
        });
      }
    };

    if (videoElement.readyState >= 3) {
      handleCanPlay();
    } else {
      videoElement.addEventListener('canplay', handleCanPlay);
    }

    return () => {
      videoElement.removeEventListener('canplay', handleCanPlay);
      holisticModel.current = null;
      setIsHolisticLoaded(false);
      setIsHolisticInitialized(false);
    };
  }, [isMissionStarting, holisticModel]);

  // 포스트잇의 위치와 크기를 계산하는 함수
  const calculatePostitPosition = (landmarks, index) => {
    // 왼쪽 끝점과 오른쪽 끝점의 x 좌표 차이를 얼굴 너비로 사용
    const faceWidth =
      Math.abs(landmarks[123].x - landmarks[352].x) * window.innerWidth;
    // 얼굴 너비를 기준으로 포스트잇 크기 조정
    const resizedSize = faceWidth * 0.33;

    // 포스트잇을 붙일 랜드마크의 좌표
    const point = landmarks[index];
    let { x, y } = point;

    // 랜드마크의 비율을 캔버스의 픽셀 값으로 변환
    x *= window.innerWidth;
    y *= window.innerHeight - 260;

    // 포스트잇의 중앙 좌표 계산 (포스트잇이 얼굴의 중앙에 위치하도록)
    const drawX = x - resizedSize / 2;
    const drawY = y - resizedSize + 125;

    // 포스트잇의 위치 및 크기 정보 반환
    return {
      top: drawY,
      left: drawX,
      size: resizedSize,
    };
  };

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {postitPositions.map((position, index) => (
        <PostitAnimation
          key={index}
          top={position.top}
          left={position.left}
          size={position.size}
          imageUrl={position.imageUrl}
          shouldFall={position?.shouldFall}
        />
      ))}
    </>
  );
};

export default Mission2;

const PostitFallAnimation = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const PostitAnimation = styled.div`
  z-index: 200;
  position: fixed;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  animation: ${props => (props.shouldFall ? PostitFallAnimation : 'none')} 1s
    ease-out forwards;
`;
