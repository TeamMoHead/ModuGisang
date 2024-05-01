export const isPastTime = timeString => {
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const timeParts = timeString.split(':');
  const timeHours = parseInt(timeParts[0], 10);
  const timeMinutes = parseInt(timeParts[1], 10);

  if (
    timeHours < currentHours ||
    (timeHours === currentHours && timeMinutes < currentMinutes)
  ) {
    return true;
  } else {
    return false;
  }
};
