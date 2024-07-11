importScripts('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');

let poseModel;

self.onmessage = async event => {
  console.log('This is Worker!!!!!!!11111111');
  if (event.data.type === 'initialize') {
    const modelPath = event.data.modelPath;
    const response = await fetch(modelPath);
    const modelBlob = await response.blob();
    const modelURL = URL.createObjectURL(modelBlob);

    poseModel = new self.Pose({
      locateFile: file => modelURL,
    });

    poseModel.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    self.postMessage({ type: 'initialized' });
  } else if (event.data.type === 'inference') {
    const imageBitmap = event.data.image;

    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    poseModel.onResults(results => {
      self.postMessage({ type: 'results', results });
    });

    await poseModel.send({ image: imageData });
  }
};
