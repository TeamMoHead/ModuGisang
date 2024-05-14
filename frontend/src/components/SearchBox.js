import styled from 'styled-components';
import Icon from './Icon';

const SearchBox = ({ value, onChange, onClickHandler }) => {
  return (
    <Wrapper>
      <InviteBox type="email" value={value} onChange={onChange} />
      <Search onClick={onClickHandler}>
        <Icon icon={'search'} iconStyle={iconStyle} />
      </Search>
    </Wrapper>
  );
};

export default SearchBox;

const Wrapper = styled.label`
  position: relative;
  width: 100%;
`;

const InviteBox = styled.input.attrs({ type: 'email' })`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.translucent.lightNavy};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary.purple};
  ${({ theme }) => theme.fonts.IBMsmall};
  color: ${({ theme }) => theme.colors.primary.white};
  padding: 15px;

  &:focus {
    outline: none; // 기본 포커스 테두리 제거
    border: 2px solid ${({ theme }) => theme.colors.primary.purple}; // 포커스 시 새로운 테두리 색상 적용
  }
`;

const Search = styled.button`
  color: white;
  position: absolute;
  top: 6px;
  right: 5px;
`;

const iconStyle = {
  size: 24,
  color: 'purple',
  hoverColor: 'white',
};
