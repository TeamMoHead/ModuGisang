import roundSound from '../../../assets/soundEffects/roundSuccess.mp3';

// 효과음 재생 함수
export const RoundSoundEffect = () => {
  const volume = 0.1;
  const audio = new Audio(roundSound);
  audio.volume = volume;

  console.log('ROUND SOUND ON!!!!!!!!');

  // 사운드 재생
  audio.play();
};
