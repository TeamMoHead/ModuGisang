import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';

const AffirmationBox = ({
  affirmation,
  setAffirmation,
  isAbleInput,
  setIsExceeded30,
}) => {
  const textAreaRef = useRef(null);
  const [error, setError] = useState('');

  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  };

  const handleChange = e => {
    const newValue = e.target.value;
    setAffirmation(newValue);

    if (newValue.length > 30) {
      setIsExceeded30(true);
      setError('30자를 넘길 수 없습니다.');
    } else {
      setIsExceeded30(false);
      setError('');
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setError('엔터를 사용할 수 없습니다.');
    }
  };

  useLayoutEffect(() => {
    if (isAbleInput && textAreaRef.current) {
      const textArea = textAreaRef.current;
      textArea.focus();
      textArea.setSelectionRange(textArea.value.length, textArea.value.length);
    }
  }, [isAbleInput]);

  useEffect(() => {
    adjustHeight();
  }, [affirmation]);

  return (
    <Wrapper>
      <InputText
        ref={textAreaRef}
        value={affirmation}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        $isAbleInput={isAbleInput}
        disabled={!isAbleInput}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
};

export default AffirmationBox;

const Wrapper = styled.div`
  width: 100%;
  height: 226px;
  ${({ theme }) => theme.flex.center};
  flex-direction: column;

  padding: 15px;

  background-color: ${({ $isAbleInput, theme }) =>
    $isAbleInput ? theme.colors.translucent.white : 'transparent'};
  border-radius: 0 0 30px 30px;
`;

const InputText = styled.textarea`
  z-index: 100;

  width: 100%;

  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => theme.fonts.IBMlarge};
  text-align: center;

  caret-color: ${({ theme, $isAbleInput }) =>
    $isAbleInput ? theme.colors.primary.emerald : 'transparent'};
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.system.red};
  font-size: 15px;
  margin-top: 5px;
  text-align: center;
`;
