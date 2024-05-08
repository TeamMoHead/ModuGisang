// try {
//   const scriptUrl = `${process.env.REACT_APP_CLIENT_URL}/pose/pose.js`;
//   console.log('!!!!@@!!!@ PATH TO MODULE:: ', process.env.REACT_APP_CLIENT_URL);
//   self.importScripts(scriptUrl);
// } catch (error) {
//   console.error('Failed to load the pose script:', error);
// }

const scriptUrl = `/pose/pose.js`;
console.log('-------Loading script from:', scriptUrl);
self.importScripts(scriptUrl);

let pose;

onmessage = function (e) {
  const { data } = e;
  switch (data.command) {
    case 'load':
      pose = new Pose({
        locateFile: file =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 0.5,
        selfieMode: true,
        smoothLandmarks: false,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(results => {
        postMessage({ type: 'results', results });
      });
      break;

    case 'send':
      pose
        .send({ image: data.image })
        .then(results => {
          if (results.poseLandmarks) {
            // latency 최적화를 위해, 여기 위치에 inference된 결과를 축소할 수 있음
            postMessage({
              type: 'results',
              poseLandmarks: results.poseLandmarks,
            });
          }
        })
        .catch(error => {
          postMessage({ type: 'error', error: error.toString() });
        });
      break;
    default:
      break;
  }
};
