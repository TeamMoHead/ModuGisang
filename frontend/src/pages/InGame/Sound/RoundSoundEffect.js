import roundSound from '../../../assets/soundEffects/roundSuccess.mp3';

// 효과음 재생 함수
export const RoundSoundEffect = () => {
  const volume = 0.5;
  const audio = new Audio(roundSound);
  audio.volume = volume;

  // 사운드 재생
  audio.play();
};
