// poseWorker.js
onmessage = function (e) {
  // 이미지 데이터 수신
  const image = e.data.image;

  // MediaPipe 포즈 로직 (가상 코드)
  try {
    importScripts('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');

    // MediaPipe 포즈 인스턴스 생성
    const pose = new Pose({
      locateFile: file =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    // 결과 처리
    pose.onResults(results => {
      postMessage({ results });
    });

    // 이미지 처리
    pose.send({ image: image });
  } catch (error) {
    postMessage({ error: error.message });
  }
};
