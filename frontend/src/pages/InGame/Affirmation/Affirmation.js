import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../../contexts';
import useSpeechToText from '../MissionEstimators/useSpeechToText';

// const Affirmation = () => {
//   const user = useContext(UserContext);
//   const affirmationText = user.userData.affirmation || '';
//   const [highlightedText, setHighlightedText] = useState('');
//   const [affirResult, setAffirResult] = useState(false);
//   const { transcript, listening, reset, stop } = useSpeechToText(10);

//   console.log(transcript);

//   useEffect(() => {
//     console.log('통과 전');
//     if (transcript === user.userData.affirmation) {
//       console.log('=================');
//       console.log(transcript);
//       console.log('통과');
//       console.log('=================');
//       stop(false);
//       setAffirResult(true);
//     }
//   });

//   return (
//     <>
//       <Affir>{user.userData.affirmation}</Affir>
//       {affirResult ? <Success> 성공! </Success> : null}
//     </>
//   );
// };

const Affirmation = () => {
  const user = useContext(UserContext);
  const affirmationText = user.userData.affirmation || '';
  const [highlightedText, setHighlightedText] = useState('');
  const { transcript, listening, reset, stop } = useSpeechToText(10);
  const [affirResult, setAffirResult] = useState(false);

  // 인식된 텍스트와 원본 문구 비교 및 강조
  useEffect(() => {
    // 비교할 값이 있을 때만 동작
    if (transcript) {
      const matchIndex = affirmationText.indexOf(transcript);
      if (matchIndex !== -1) {
        const highlighted = (
          <>
            <Highlight>{affirmationText.substring(0, matchIndex)}</Highlight>
            <Highlighted>
              {affirmationText.substring(
                matchIndex,
                matchIndex + transcript.length,
              )}
            </Highlighted>
            <Highlight>
              {affirmationText.substring(matchIndex + transcript.length)}
            </Highlight>
          </>
        );
        setHighlightedText(highlighted);
      } else {
        setHighlightedText(<Highlight>{affirmationText}</Highlight>);
      }

      // 인식된 텍스트가 정확히 일치할 경우
      if (transcript.trim() === affirmationText.trim() && !affirResult) {
        console.log('통과');
        stop(false); // 음성 인식 중지
        setAffirResult(true); // 이미 통과 상태로 설정
      }
    } else {
      setHighlightedText(<Highlight>{affirmationText}</Highlight>);
    }
  }, [transcript, affirmationText, affirResult, stop]);

  return (
    <>
      <Affir>{highlightedText}</Affir>
      {affirResult ? <Success>성공!</Success> : null}
    </>
  );
};

export default Affirmation;

const Affir = styled.div`
  position: fixed;
  top: 200px;
  width: 100%;
  height: auto;
  padding: 0 30px;
  ${({ theme }) => theme.flex.center}
  font: ${({ theme }) => theme.fonts.content};
  line-height: 1.2;
  font-size: 30px;
  /* background-color: ${({ theme }) => theme.colors.lighter.dark}; */
`;

const Highlight = styled.span`
  color: grey;
`;

const Highlighted = styled.span`
  color: ${({ theme }) => theme.colors.primary.emerald};
  font-weight: bold;
`;

const Success = styled.div`
  position: fixed;
  top: 300px;
  height: auto;
  padding: 0 30px;
  ${({ theme }) => theme.flex.center}
  ${({ theme }) => theme.flex.center}
  font: ${({ theme }) => theme.fonts.content};
  line-height: 1.2;
  font-size: 30px;
`;
