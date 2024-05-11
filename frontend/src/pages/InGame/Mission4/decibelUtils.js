export function calculateDecibels(analyser, dataArray, bufferLength) {
  analyser.getByteTimeDomainData(dataArray);

  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    const value = (dataArray[i] - 128) / 128;
    sum += value * value;
  }

  const rms = Math.sqrt(sum / bufferLength);
  return 40 * Math.log10(rms) + 100;
}
