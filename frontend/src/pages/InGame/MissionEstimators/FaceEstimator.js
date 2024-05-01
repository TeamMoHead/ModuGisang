import { FACEMESH_TESSELATION } from '@mediapipe/holistic';
import { drawConnectors } from '@mediapipe/drawing_utils';

export const estimateFace = ({ results, myVideoRef, canvasRef }) => {
  if (!myVideoRef.current || !canvasRef.current) return;

  const canvasElement = canvasRef.current;
  const canvasCtx = canvasElement.getContext('2d');
  if (canvasCtx == null) throw new Error('Could not get context');
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'source-in';
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = 'destination-atop';

  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height,
  );

  canvasCtx.globalCompositeOperation = 'source-over';

  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
    color: '#C0C0C070',
    lineWidth: 1,
  });

  canvasCtx.restore();
};
