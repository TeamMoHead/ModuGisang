const useCheckTime = wakeTime => {
  const now = new Date();
  const wakeTimeDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // 다음 날 자정
    0,
    0,
    0,
    0,
  );

  const [hours, minutes] = wakeTime.split(':').map(Number);
  wakeTimeDate.setHours(hours, minutes, 0, 0);

  // isTooEarly: 현재가 wakeTime의 10분 전보다 더 일찍인 경우
  const isTooEarly = now.getTime() < wakeTimeDate.getTime() - 600000;

  // isTooLate: 현재 시각이 wakeTime으로부터 3초가 지나고, 오늘 자정이 지나지 않은 경우 true
  const isTooLate =
    now.getTime() > wakeTimeDate.getTime() + 3000 &&
    now.getTime() < midnight.getTime();

  const remainingTime = wakeTimeDate.getTime() - now.getTime();

  return { isTooEarly, isTooLate, remainingTime };
};

export default useCheckTime;
