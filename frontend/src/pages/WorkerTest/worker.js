import {
  PoseLandmarker,
  FilesetResolver,
} from 'https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0';

let poseLandmarker;

async function initializePoseLandmarker() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm',
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numPoses: 2,
    });
    self.postMessage({ type: 'initialized' });
  } catch (error) {
    console.error('<Worker> Error initializing PoseLandmarker:', error);
    self.postMessage({ type: 'error', error: error.toString() });
  }
}

self.onmessage = function (event) {
  switch (event.data.type) {
    case 'initialize':
      initializePoseLandmarker();
      break;
    case 'detect':
      if (!poseLandmarker) {
        console.error('<Worker> PoseLandmarker not initialized');
        return;
      }
      const startTime = performance.now();
      const results = poseLandmarker.detectForVideo(
        event.data.image,
        startTime,
      );
      const inferenceTime = performance.now() - startTime;
      self.postMessage({
        type: 'results',
        results: results,
        inferenceTime: inferenceTime, // inferenceTime 추가
      });
      break;
    case 'stop':
      console.log('<Worker> Stopping worker');
      self.postMessage({ type: 'stopped' });
      break;
    default:
      console.warn('<Worker> Unknown message type:', event.data.type);
  }
};

self.postMessage({ type: 'ready' });
