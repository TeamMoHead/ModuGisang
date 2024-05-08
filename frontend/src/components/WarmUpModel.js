import { useEffect, useRef, useContext } from 'react';
import { MediaPipeContext } from '../contexts/MediaPipeContext';
import poseSampleImage from '../assets/imageForMediaPipe/poseSample.png';
import faceSampleImage from '../assets/imageForMediaPipe/faceSample.png';

const WarmUpModel = () => {
  const {
    isPoseLoaded,
    setIsPoseInitialized,
    isHolisticLoaded,
    poseModel,
    holisticModel,
  } = useContext(MediaPipeContext);
  const poseCanvasRef = useRef(null);
  const poseImageRef = useRef(null);
  const holisticCanvasRef = useRef(null);
  const holisticImageRef = useRef(null);

  useEffect(() => {
    if (!poseModel.current) return;
    const image = new Image();
    image.src = poseSampleImage;

    image.onload = () => {
      const canvas = poseCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (poseModel.current) {
        poseModel.current.onResults(results => {
          console.log('###### MEDIA_PIPE CONTEXT : POSE #######', results);
        });

        poseModel.current
          .send({ image: imageData })
          .then(results => {
            console.log('======> POSE Inference results:', results);
            setIsPoseInitialized(true);
          })
          .catch(error => {
            console.error('Error during %% POSE %% model inference:', error);
          });
      }
    };

    poseImageRef.current = image;
  }, [poseModel, poseCanvasRef, isPoseLoaded]);

  useEffect(() => {
    if (!isHolisticLoaded) return;

    const image = new Image();
    image.src = faceSampleImage;

    image.onload = () => {
      const canvas = holisticCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (holisticModel.current) {
        holisticModel.current.onResults(results => {
          console.log('###### MEDIA_PIPE CONTEXT : POSE #######', results);
        });

        holisticModel.current
          .send({ image: imageData })
          .then(results => {
            console.log('=========> HOLISTIC Inference results:', results);
          })
          .catch(error => {
            console.error(
              'Error during ** HOLISTIC ** model inference:',
              error,
            );
          });
      }

      holisticImageRef.current = image;
    };
  }, [holisticModel, holisticCanvasRef, isHolisticLoaded]);

  return (
    <>
      <canvas ref={poseCanvasRef} style={{ display: 'none' }} />
      <canvas ref={holisticCanvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default WarmUpModel;
