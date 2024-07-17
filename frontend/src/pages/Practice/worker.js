import {
  PoseLandmarker,
  FilesetResolver,
} from 'https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0';

console.log('Worker script started');

let poseLandmarker;

async function initializePoseLandmarker() {
  console.log('Initializing PoseLandmarker');
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
    console.log('PoseLandmarker initialized');
    self.postMessage({ type: 'initialized' });
  } catch (error) {
    console.error('Error initializing PoseLandmarker:', error);
    self.postMessage({ type: 'error', error: error.toString() });
  }
}

function detectPose(imageBitmap) {
  if (!poseLandmarker) {
    console.error('PoseLandmarker not initialized');
    return;
  }
  const startTimeMs = performance.now();
  const results = poseLandmarker.detectForVideo(imageBitmap, startTimeMs);
  self.postMessage({ type: 'results', results });
}

self.onmessage = function (event) {
  console.log('Worker received message:', event.data);

  switch (event.data.type) {
    case 'initialize':
      initializePoseLandmarker();
      break;
    case 'detect':
      detectPose(event.data.image);
      break;
    default:
      console.warn('Unknown message type:', event.data.type);
  }
};

console.log('Worker script loaded');
self.postMessage({ type: 'ready' });
