import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../../contexts';
import useSpeechToText from '../MissionEstimators/useSpeechToText';

const Affirmation = () => {
  const user = useContext(UserContext);
  const affirmationText = user.userData.affirmation || '';
  const [highlightedText, setHighlightedText] = useState('');
  const { transcript, listening, reset, stop } = useSpeechToText(10);
  const [affirResult, setAffirResult] = useState(false);
  console.log(transcript);
  console.log(listening);

  // 인식된 텍스트와 원본 문구 비교 및 강조
  useEffect(() => {
    if (affirResult) {
      console.log('끝');
      return;
    }
    // 비교할 값이 있을 때만 동작
    if (transcript) {
      const matchIndex = affirmationText.indexOf(transcript);
      console.log('인덱스 값 : ', matchIndex);
      if (matchIndex !== -1) {
        if (affirmationText[matchIndex] === transcript[matchIndex]) {
          const highlighted = (
            <>
              <Highlight>
                {affirmationText.substring(0, matchIndex)}
                <Highlighted>
                  {affirmationText.substring(
                    matchIndex,
                    matchIndex + transcript.length,
                  )}
                </Highlighted>
                {affirmationText.substring(matchIndex + transcript.length)}
              </Highlight>
            </>
          );
          setHighlightedText(highlighted);
        }
      } else {
        // reset();
        setHighlightedText(<Highlight>{affirmationText}</Highlight>);
      }

      // 인식된 텍스트가 정확히 일치할 경우
      if (transcript.trim() === affirmationText.trim() && !affirResult) {
        console.log('통과');
        stop(); // 음성 인식 중지
        setAffirResult(true); //  통과 상태로 설정
      }
    } else {
      setHighlightedText(<Highlight>{affirmationText}</Highlight>);
    }
  }, [transcript, affirmationText, affirResult]);

  return (
    <>
      <Wrapper>
        <Text>{highlightedText}</Text>
      </Wrapper>

      {affirResult ? <Success>성공!</Success> : null}
    </>
  );
};

export default Affirmation;

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

const Text = styled.p`
  position: absolute;
  top: 33%;
  left: 50%;
  transform: translate(-50%, -33%);

  ${({ theme }) => theme.flex.center}
  width: 90%;
  height: 50%;
  padding: 15px;

  ${({ theme }) => theme.fonts.content}
  color:${({ theme }) => theme.colors.primary.dark};
  font-size: 2rem;
  text-align: center;

  background-color: ${({ theme }) => theme.colors.lighter.light};
  border-radius: ${({ theme }) => theme.radius.basic};
  border: 3px solid ${({ theme }) => theme.colors.lighter.purple};
`;

const Highlight = styled.span`
  color: grey;
`;

const Highlighted = styled.b`
  color: ${({ theme }) => theme.colors.primary.emerald};
  font-weight: bold;
`;

const Success = styled.div`
  position: fixed;
  top: 300px;
  left: 50px;
  height: auto;
  padding: 0 30px;
  ${({ theme }) => theme.flex.center}
  ${({ theme }) => theme.flex.center}
  font: ${({ theme }) => theme.fonts.content};
  line-height: 1.2;
  font-size: 30px;
`;
