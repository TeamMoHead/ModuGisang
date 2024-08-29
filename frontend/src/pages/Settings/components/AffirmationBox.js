import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const AffirmationBox = ({ value, onChange, disabled, setIsExceeded30 }) => {
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
    if (newValue.length > 30) {
      setIsExceeded30(true);
      setError('30자를 넘길 수 없습니다.');
    } else {
      setIsExceeded30(false);
      setError('');
      onChange(e);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setError('엔터를 사용할 수 없습니다.');
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <Wrapper>
      <InputText
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
};

export default AffirmationBox;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.flex.center};
  flex-direction: column;
`;

const InputText = styled.textarea`
  z-index: 100;

  width: 100%;

  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => theme.fonts.IBMlarge};
  text-align: center;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.system.red};
  font-size: 15px;
  margin-top: 5px;
  text-align: center;
`;
