import React, { useState, useRef } from 'react';
import styled from 'styled-components';

const InputBox = ({ value, onChange, disabled }) => {
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  const handleChange = e => {
    const newValue = e.target.value;
    if (newValue.length <= 30) {
      setError('');
      onChange(e);
    } else {
      setError('30자를 넘길 수 없습니다.');
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setError('엔터를 사용할 수 없습니다.');
    }
  };

  return (
    <Wrapper>
      <InputText
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        cols="10"
        rows="1"
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
};

export default InputBox;

const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputText = styled.textarea`
  width: 100%;
  ${({ theme }) => theme.flex.center};
  color: ${({ theme }) => theme.colors.primary.white};
  z-index: 100;
  ${({ theme }) => theme.fonts.IBMlarge};
  text-align: center;
  vertical-align: middle;
  overflow: hidden;
  resize: none;
  box-sizing: border-box;
  line-height: 1.5;
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.system.red};
  font-size: 15px;
  margin-top: 5px;
  text-align: center;
`;
