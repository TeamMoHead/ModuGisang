const createPerformanceMonitor = (sampleSize = 1000) => {
  let performanceData = {
    inferenceTimes: [],
    startTime: 0,
    frameCount: 0,
  };

  const collectData = inferenceTime => {
    if (performanceData.frameCount === 0) {
      performanceData.startTime = performance.now();
    }
    performanceData.inferenceTimes.push(inferenceTime);
    performanceData.frameCount++;
  };

  const analyzePerformance = () => {
    const totalTime = performance.now() - performanceData.startTime;
    const avgInferenceTime =
      performanceData.inferenceTimes.reduce((a, b) => a + b, 0) /
      performanceData.frameCount;
    const maxInferenceTime = Math.max(...performanceData.inferenceTimes);
    const minInferenceTime = Math.min(...performanceData.inferenceTimes);
    const fps = 1000 / avgInferenceTime;

    return {
      avgInferenceTime,
      maxInferenceTime,
      minInferenceTime,
      fps,
      totalFrames: performanceData.frameCount,
      totalTime,
    };
  };

  const reset = () => {
    performanceData = {
      inferenceTimes: [],
      startTime: 0,
      frameCount: 0,
    };
  };

  return { collectData, analyzePerformance, reset };
};

export default createPerformanceMonitor;
