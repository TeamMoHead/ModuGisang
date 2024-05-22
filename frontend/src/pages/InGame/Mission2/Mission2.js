import React, { useEffect, useContext, useState } from 'react';
import {
  MediaPipeContext,
  GameContext,
  OpenViduContext,
} from '../../../contexts';
import { MissionStarting, MissionEnding } from '../components';
import styled, { keyframes, css } from 'styled-components';
import {
  green0,
  green1,
  green2,
  green3,
  green4,
  pink0,
  pink1,
  pink2,
  pink3,
  pink4,
  yellow0,
  yellow1,
  yellow2,
  yellow3,
  yellow4,
} from '../../../assets/postit/index';

let topScore = 0;
let leftScore = 0;
let rightScore = 0;
let targetNumber = 16;
let prevTopEyebrow = null;
let prevLeftCheek = null;
let prevRightCheek = null;
let prevforehead = null;
let isMovingScore = 0;
let isMovingStatus = true; // 움직이는 중인지 여부
let myPostitStatus = [false, false, false]; // 측정 결과
const timeoutDuration = 27000; // 제한 시간
let isTimeOut = false; // 타임 아웃 여부
let isGameStart = false;

const Mission2 = () => {
  const [postitPositions, setPostitPositions] = useState([
    {
      // 이마
      top: 0, // y 좌표
      left: 0, // x 좌표
      size: 0, // width, height
      imageUrl: yellow0,
      shouldFall: false, // 포스트잇이 떨어졌는지 여부
      scorePoint: 8, // 더할 점수. 이마는 상대적으로 떼기 어려워서 추가 점수 있음
    },
    {
      // 왼쪽 볼
      top: 0,
      left: 0,
      size: 0,
      imageUrl: pink0,
      shouldFall: false,
      scorePoint: 6,
    },
    {
      // 오른쪽 볼
      top: 0,
      left: 0,
      size: 0,
      imageUrl: green0,
      shouldFall: false,
      scorePoint: 6,
    },
  ]); // 포스트잇의 정보

  const [paperImg, setPaperImg] = useState([
    {
      imageUrl: pink1,
      count: 0,
      shouldFall: false,
    },
    {
      imageUrl: yellow1,
      count: 0,
      shouldFall: false,
    },
    {
      imageUrl: green1,
      count: 0,
      shouldFall: false,
    },
  ]); // 상태 UI

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

  const updatePaperImg = (index, newImgData) => {
    setPaperImg(prevPaperImg => {
      const updatedPaperImg = [...prevPaperImg];
      updatedPaperImg[index] = {
        ...updatedPaperImg[index],
        ...newImgData,
      };
      return updatedPaperImg;
    });
  };

  const postitGame = faceLandmarks => {
    if (!faceLandmarks) return;

    const foreheadIndex = 10;
    const forehead = faceLandmarks[foreheadIndex];
    if (prevforehead) {
      const deltaforeheadX = Math.abs(forehead.x - prevforehead.x);
      const deltaforeheadY = Math.abs(forehead.y - prevforehead.y);

      // 윗 입술 높이와 비례해서 움직임 판정
      const heightLip =
        Math.abs(faceLandmarks[0].y - faceLandmarks[12].y) * 1.4;

      if (deltaforeheadX + deltaforeheadY > heightLip) {
        isMovingStatus = true;
        isMovingScore = 0;
        // console.log('----- 움직이는 중');
      } else {
        isMovingScore += 1;

        if (isMovingScore > 10) {
          isMovingStatus = false;
        }
      }

      const topEyebrow = faceLandmarks[107]; // 눈썹
      const leftCheek = faceLandmarks[61]; // 왼쪽 볼
      const rightCheek = faceLandmarks[291]; // 오른쪽 볼

      if (!isMovingStatus && !isTimeOut) {
        // 눈썹 움직임 확인
        if (topScore < targetNumber && !myPostitStatus[0]) {
          // 이전 볼의 좌표랑 비교해서 움직임을 확인
          if (prevTopEyebrow) {
            const deltaTopY = Math.abs(topEyebrow.y - prevTopEyebrow.y);
            if (deltaTopY > heightLip * 0.6) {
              topScore += 1;

              if (topScore === 4) {
                updatePaperImg(1, {
                  imageUrl: yellow2,
                  count: 1,
                  shouldFall: false,
                });

                // setPaperImg(prevPaperImg => [
                //   ...prevPaperImg.slice(0, 1),
                //   {
                //     imageUrl: yellow2,
                //     count: 1,
                //     shouldFall: false,
                //   },
                //   ...prevPaperImg.slice(2), // 나머지 요소는 유지
                // ]);
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
              } else if (topScore === 6) {
                updatePaperImg(1, {
                  imageUrl: yellow3,
                  count: 2,
                  shouldFall: false,
                });

                // setPaperImg(prevPaperImg => [
                //   ...prevPaperImg.slice(0, 1),
                //   {
                //     imageUrl: yellow3,
                //     count: 2,
                //     shouldFall: false,
                //   },
                //   ...prevPaperImg.slice(2),
                // ]);
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
              } else if (topScore >= targetNumber / 2) {
                updatePaperImg(1, {
                  imageUrl: yellow4,
                  count: 3,
                  shouldFall: true,
                });

                // setPaperImg(prevPaperImg => [
                //   ...prevPaperImg.slice(0, 1),
                //   {
                //     imageUrl: yellow4,
                //     count: 3,
                //     shouldFall: true,
                //   },
                //   ...prevPaperImg.slice(2),
                // ]);
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
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
              // console.log('----- leftScore:', leftScore);

              if (leftScore === 6) {
                updatePaperImg(0, {
                  imageUrl: pink2,
                  count: 1,
                  shouldFall: false,
                });

                // setPaperImg(prevPaperImg => [
                //   {
                //     imageUrl: pink2,
                //     count: 1,
                //     shouldFall: false,
                //   },
                //   ...prevPaperImg.slice(1),
                // ]);
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
              } else if (leftScore === 10) {
                updatePaperImg(0, {
                  imageUrl: pink3,
                  count: 2,
                  shouldFall: false,
                });

                // setPaperImg(prevPaperImg => [
                //   {
                //     imageUrl: pink3,
                //     count: 2,
                //     shouldFall: false,
                //   },
                //   ...prevPaperImg.slice(1),
                // ]);
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
              } else if (leftScore >= targetNumber) {
                updatePaperImg(0, {
                  imageUrl: pink4,
                  count: 3,
                  shouldFall: true,
                });

                // setPaperImg(prevPaperImg => [
                //   {
                //     imageUrl: pink4,
                //     count: 3,
                //     shouldFall: true,
                //   },
                //   ...prevPaperImg.slice(1),
                // ]);
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
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
              // console.log('----- rightScore:', rightScore);

              if (rightScore === 6) {
                updatePaperImg(2, {
                  imageUrl: green2,
                  count: 1,
                  shouldFall: false,
                });

                // setPaperImg(prevPaperImg => [
                //   ...prevPaperImg.slice(0, 2),
                //   {
                //     imageUrl: green2,
                //     count: 1,
                //     shouldFall: false,
                //   },
                // ]);
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
              } else if (rightScore === 10) {
                updatePaperImg(2, {
                  imageUrl: green3,
                  count: 2,
                  shouldFall: false,
                });

                // setPaperImg(prevPaperImg => [
                //   ...prevPaperImg.slice(0, 2),
                //   {
                //     imageUrl: green3,
                //     count: 2,
                //     shouldFall: false,
                //   },
                // ]);
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
              } else if (rightScore >= targetNumber) {
                updatePaperImg(2, {
                  imageUrl: green4,
                  count: 3,
                  shouldFall: true,
                });

                // setPaperImg(prevPaperImg => [
                //   ...prevPaperImg.slice(0, 2),
                //   {
                //     imageUrl: green4,
                //     count: 3,
                //     shouldFall: true,
                //   },
                // ]);
                myPostitStatus[2] = true;
                setIsRoundPassed(true);
                setTimeout(() => setIsRoundPassed(false), 100);
              }
            }
          }
        }
      }
      prevTopEyebrow = { x: topEyebrow.x, y: topEyebrow.y }; // 이전 눈썹 위치 갱신
      prevLeftCheek = { x: leftCheek.x, y: leftCheek.y }; // 이전 좌측 볼의 좌표 갱신
      prevRightCheek = { x: rightCheek.x, y: rightCheek.y }; // 이전 우측 볼의 좌표 갱신
    }
    prevforehead = { x: forehead.x, y: forehead.y };

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
            index === 0 ? 107 : index === 1 ? 147 : 376, // 각 포스트잇의 위치 계산(0: 이마, 1: 왼쪽 볼, 2: 오른쪽 볼)
          );
          setPostitPositions(prevPositions => {
            const updatedPositions = [...prevPositions];
            updatedPositions[index] = {
              ...updatedPositions[index],
              ...newPostitPosition,
            };
            return updatedPositions;
          });
        } else {
          setPostitPositions(prevPositions => {
            const updatedPositions = [...prevPositions];

            // 점수 갱신
            if (!isTimeOut && !updatedPositions[index].shouldFall) {
              setGameScore(
                prevScore => prevScore + updatedPositions[index].scorePoint,
              );
              // 포스트잇 떨어지도록 인자 변경
              updatedPositions[index] = {
                ...prevPositions[index],
                shouldFall: true,
              };
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
    const resizedSize = faceWidth * 0.4;

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
      <PaperBox>
        {paperImg.map((paper, index) => (
          <Paper
            key={index}
            imageUrl={paper.imageUrl}
            count={paper.count}
            shouldFall={paper?.shouldFall}
          />
        ))}
      </PaperBox>
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

const PaperBox = styled.div`
  z-index: 200;

  position: absolute;
  bottom: 25px;

  width: calc(100% - 6px);
  height: 70px;
  padding: 0 30px;

  ${({ theme }) => theme.flex.between}

  background-color: ${({ theme }) => theme.colors.translucent.lightNavy};
`;

const Paper = styled.div`
  width: 60px;
  height: 60px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  animation: ${props => {
    const fallAnimation = props.shouldFall
      ? css`
          ${PostitFallAnimation} 1s ease-out forwards
        `
      : 'none';
    const glowAnimation =
      props.count > 0
        ? css`
            ${glow(getGlowColor(props.count))} 500ms alternate
          `
        : 'none';
    const shakeAnimation =
      props.count > 0
        ? css`
            ${getShakeAnimation(props.count)} 500ms alternate
          `
        : 'none';
    return css`
      ${fallAnimation}, ${glowAnimation}, ${shakeAnimation}
    `;
  }};
`;

const glow = color => keyframes`
  from {
    box-shadow: 0 0 10px #fff, 0 0 20px ${color}, 0 0 30px ${color}, 0 0 40px ${color}, 0 0 50px ${color}, 0 0 60px ${color}, 0 0 70px ${color};
  }
  to {
    box-shadow: 0 0 20px #fff, 0 0 40px ${color}, 0 0 60px ${color}, 0 0 80px ${color}, 0 0 100px ${color}, 0 0 120px ${color}, 0 0 140px ${color};
  }
`;

const getShakeAnimation = count => {
  switch (count) {
    case 1:
      return shakeOne;
    case 2:
      return shakeTwo;
    case 3:
      return shakeThree;
    default:
      return 'none';
  }
};

const shakeOne = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
`;

const shakeTwo = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-15px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(15px);
  }
`;

const shakeThree = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-20px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(20px);
  }
`;
const getShake = count => {
  switch (count) {
    case 1:
      return '10px';
    case 2:
      return '20px';
    case 3:
      return '30px';
    default:
      return '0';
  }
};

const getGlowColor = count => {
  switch (count) {
    case 1:
      return '#FFC500'; // 노란색
    case 2:
      return '#FFC501'; //빨간색
    case 3:
      return '#FFC502'; // 흰색
    default:
      return 'none';
  }
};
