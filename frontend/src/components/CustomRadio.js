import styled from 'styled-components';

const CustomRadio = ({ name, content, onChange, selectedValue }) => {
  return (
    <>
      {content.map((item, idx) => (
        <Wrapper key={idx}>
          <RadioBtn
            type="radio"
            checked={Number(selectedValue) === item.value}
            name={name}
            value={item.value}
            onChange={onChange}
            id={idx}
          />
          <label htmlFor={idx}>{item.label}</label>
        </Wrapper>
      ))}
    </>
  );
};

export default CustomRadio;

const Wrapper = styled.div`
  font: ${({ theme }) => theme.fonts.IBMsmall};
  ${({ theme }) => theme.flex.center};
`;

const RadioBtn = styled.input.attrs({ type: 'radio' })`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 17px;
  height: 17px;
  border: 2px solid #ccc;
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease; // 부드러운 트랜지션 효과
  margin: 7px;
  &:checked {
    background: ${({ theme }) => theme.gradient.largerEmerald};
    border: 2px solid black;
    box-shadow: 0 0 0 1.6px ${({ theme }) => theme.colors.primary.emerald};
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.5); // 포커스 시 보더 쉐도우 추가
  }
`;
