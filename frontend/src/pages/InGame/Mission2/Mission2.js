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
let targetNumber = 5;
let prevTopEyebrowPosition = null;
let prevLeftCheekPosition = null;
let prevRightCheekPosition = null;
let prevJawPosition = null;
let isMovingScore = 0;
let isMovingStatus = true; // 움직이는 중인지 여부
let myPostitStatus = [false, false, false]; // 측정 결과

const Mission2 = () => {
  const [postitPositions, setPostitPositions] = useState([
    {
      // 이마
      top: 0, // y 좌표
      left: 0, // x 좌표
      size: 0, // width, height
      shouldFall: false, // 포스트잇이 떨어졌는지 여부
      scorePoint: 9, // 더할 점수. 이마는 상대적으로 떼기 어려워서 추가 점수 있음
    },
    {
      // 왼쪽 볼
      top: 0,
      left: 0,
      size: 0,
      shouldFall: false,
      scorePoint: 8,
    },
    {
      // 오른쪽 볼
      top: 0,
      left: 0,
      size: 0,
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
    isMusicMuted,
    myMissionStatus,
    setMyMissionStatus,
    setGameScore,
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

      const underLipIndex = 199; // 좌측 볼 인덱스
      const underLip = faceLandmarks[underLipIndex];
      const heightJaw = Math.abs(jaw.y - underLip.y);
      // console.log(
      //   '------ heightJaw: ',
      //   faceLandmarks[152].y - faceLandmarks[199].y,
      // );
      // console.log(
      //   '------ heightLip: ',
      //   faceLandmarks[0].y - faceLandmarks[12].y,
      // );

      if (deltaJawX > heightJaw || deltaJawY > heightJaw) {
        isMovingScore = 0;
        isMovingStatus = true;
      } else {
        isMovingScore += 1;

        if (isMovingScore > 50) {
          isMovingStatus = false;
        }
      }
      const topEyebrowIndex = 107; // 눈썹 인덱스
      const topEyebrow = faceLandmarks[topEyebrowIndex];

      const leftCheekIndex = 61; // 우측 볼 인덱스
      const leftCheek = faceLandmarks[leftCheekIndex];

      const rightCheekIndex = 291; // 우측 볼 인덱스
      const rightCheek = faceLandmarks[rightCheekIndex];

      if (!isMovingStatus) {
        // 윗 입술의 높이
        const heightLip =
          Math.abs(faceLandmarks[0].y - faceLandmarks[12].y) * 0.45;

        // 눈썹 높이
        if (topEyebrow && topScore < targetNumber) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevTopEyebrowPosition) {
            // const deltaTopX = topEyebrow.x - prevTopEyebrowPosition.x;
            const deltaTopY = topEyebrow.y - prevTopEyebrowPosition.y;

            // // 눈썹 높이
            // const heightEyebrow =
            //   Math.abs(topEyebrow.y - results.faceLandmarks[65].y) * 0.5;
            // console.log('deltaTopY:', topEyebrow.y - prevTopEyebrowPosition.y);
            if (Math.abs(deltaTopY) > heightLip * 1.8) {
              topScore = topScore + 1;
              // console.log('----topScore:  ', topScore);

              if (topScore >= targetNumber) {
                myPostitStatus[0] = true;
                // drawImageOnFace(canvasCtx, results.faceLandmarks, 107, image);
              }
            }
          }
        }

        // 좌측 볼 움직임 확인
        if (leftCheek && leftScore < targetNumber) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevLeftCheekPosition) {
            const deltaLeftX = leftCheek.x - prevLeftCheekPosition.x;
            const deltaLeftY = leftCheek.y - prevLeftCheekPosition.y;
            // console.log('deltaLeftY:', leftCheek.y - prevLeftCheekPosition.y);
            if (
              Math.abs(deltaLeftY) > heightLip &&
              Math.abs(deltaLeftX) > heightLip
            ) {
              leftScore = leftScore + 1;
              // console.log('----leftScore:  ', leftScore);

              if (leftScore >= targetNumber) {
                myPostitStatus[1] = true;
                // drawImageOnFace(canvasCtx, results.faceLandmarks, 205, image);
              }
            }
          }
        }

        // 우측 볼 움직임 확인
        // console.log('----right cheek:  ', rightCheek);
        if (rightCheek && rightScore < targetNumber) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevRightCheekPosition) {
            const deltaRightX = rightCheek.x - prevRightCheekPosition.x;
            const deltaRightY = rightCheek.y - prevRightCheekPosition.y;
            // console.log('----deltaRightY:', deltaRightY);
            if (
              Math.abs(deltaRightX) > heightLip &&
              Math.abs(deltaRightY) > heightLip
            ) {
              rightScore = rightScore + 1;
              // console.log('----rightScore:  ', rightScore);

              if (rightScore >= targetNumber) {
                myPostitStatus[2] = true;
                // drawImageOnFace(canvasCtx, results.faceLandmarks, 425, image);
              }
            }
          }
        }
      }
      // 이전 눈썹 위치 갱신
      prevTopEyebrowPosition = { x: topEyebrow.x, y: topEyebrow.y };
      // 이전 좌측 볼의 좌표 갱신
      prevLeftCheekPosition = { x: leftCheek.x, y: leftCheek.y };
      // 이전 우측 볼의 좌표 갱신
      prevRightCheekPosition = { x: rightCheek.x, y: rightCheek.y };
    }
    prevJawPosition = { x: jaw.x, y: jaw.y };

    // missionStatus가 모두 true면
    if (
      myPostitStatus &&
      myPostitStatus.every(status => status === true) &&
      myPostitStatus.every(shouldFall => shouldFall === true)
    ) {
      setMyMissionStatus(true);
    } else if (faceLandmarks && !myMissionStatus) {
      myPostitStatus?.forEach((status, index) => {
        if (!status) {
          const newPostitPosition = calculatePostitPosition(
            faceLandmarks,
            index === 0 ? 107 : index === 1 ? 205 : 425, // 각 포스트잇의 위치 계산(0: 이마, 1: 왼쪽 볼, 2: 오른쪽 볼)
          );
          setPostitPositions(prevPositions => {
            const updatedPositions = [...prevPositions];
            updatedPositions[index] = {
              ...newPostitPosition,
            };
            return updatedPositions;
          });
        } else {
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
              if (!isMusicMuted) {
                RoundSoundEffect();
              }
            }
            return updatedPositions;
          });
        }
      });
    } else if (!faceLandmarks) {
      // 얼굴이 카메라 밖일 때 포스트잇 처리
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
    // 현재 윈도우의 크기
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    // 얼굴 크기 계산
    // 왼쪽 끝점과 오른쪽 끝점의 x 좌표 차이를 얼굴 너비로 사용
    // 그 후 canvas와의 크기를 고려하여 비율 조정
    const faceWidth =
      Math.abs(landmarks[123].x - landmarks[352].x) *
      myVideoRef.current.videoWidth *
      (window.innerHeight / myVideoRef.current.videoHeight);

    // 얼굴 너비랑 비례에서 포스트잇 크기 조절
    const resizedSize = faceWidth * 0.33;

    // 포스트잇을 붙일 랜드마크의 좌표
    const point = landmarks[index];
    let { x, y } = point;

    // 랜드마크의 비율을 캔버스의 픽셀 값으로 변환
    const temp =
      (winHeight / myVideoRef.current.videoHeight) *
      myVideoRef.current.videoWidth;

    x *= temp;
    y *= winHeight;

    // 포스트잇의 중앙 좌표 계산 (포스트잇이 얼굴의 중앙에 위치하도록)
    const drawX = x - resizedSize / 2 - (temp - winWidth) / 2;
    const drawY = y - resizedSize / 2;

    if (index === 107) {
      console.log('---------- top: ', drawY);
    }

    // 포스트잇의 위치 및 크기 정보 반환
    return {
      top: drawY,
      left: drawX,
      size: resizedSize,
      scorePoint: index === 107 ? 9 : 8, // 이마는 9점, 볼은 8점
    };
  };

  return (
    <>
      <MissionStarting />
      {isMissionEnding && <MissionEnding />}
      {isMissionEnding && <MissionSoundEffects />}
      {postitPositions.map((position, index) => (
        <PostitAnimation
          key={index}
          top={position.top}
          left={position.left}
          size={position.size}
          imageUrl={stickyNoteImage}
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
