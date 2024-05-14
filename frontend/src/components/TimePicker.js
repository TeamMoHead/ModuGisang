import styled, { css } from 'styled-components';
import { useRef, useEffect, useState } from 'react';

const TimePicker = ({ list, onSelectedChange, pos, isList }) => {
  const SCROLL_DEBOUNCE_TIME = 100;

  const newList = ['', ...list, ''];
  const ref = useRef(null);
  const [selected, setSelected] = useState(1);
  const itemRefs = useRef([]);
  const timerRef = useRef(null);
  const ITEM_HEIGHT = 50;

  const handleScroll = () => {
    if (ref.current) {
      clearTimeout(timerRef.current);
      if (ref.current.scrollTop < ITEM_HEIGHT) {
        ref.current.scrollTop = ITEM_HEIGHT;
      }
      timerRef.current = setTimeout(() => {
        const index = Math.floor(
          (ref.current.scrollTop + ITEM_HEIGHT / 2) / ITEM_HEIGHT,
        );
        if (list[index] !== '') {
          setSelected(index);
          itemRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          if (onSelectedChange) {
            onSelectedChange(newList[index]);
          }
        }
      }, SCROLL_DEBOUNCE_TIME);
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = selected * ITEM_HEIGHT;
    }
  }, []);

  return (
    <List isList={isList} ref={ref} onScroll={handleScroll}>
      <ListCenter pos={pos} />
      {newList.map((item, index) => (
        <ListItem
          key={index}
          isSelected={index === selected}
          ref={el => (itemRefs.current[index] = el)}
        >
          {item}
        </ListItem>
      ))}
    </List>
  );
};

export default TimePicker;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: ${({ isList }) => (isList ? '120px' : '10px')};
  height: 150px;
  overflow-y: scroll;
  position: relative;

  // Chrome, Safari 및 Opera를 위한 스타일
  &::-webkit-scrollbar {
    display: none;
  }

  // Firefox를 위한 스타일
  scrollbar-width: none;

  // IE 및 Edge를 위한 스타일
  -ms-overflow-style: none;
`;

const ListCenter = styled.div`
  box-sizing: border-box;
  /* border-top: 1.3px solid black; */
  border-top: 1.5px solid ${({ theme }) => theme.colors.primary.purple};
  border-bottom: 1.5px solid ${({ theme }) => theme.colors.primary.purple};
  border-left: ${({ pos, theme }) =>
    pos === 'left' ? '1.5px solid' + theme.colors.primary.purple : null};
  border-right: ${({ pos, theme }) =>
    pos === 'right' ? '1.5px solid' + theme.colors.primary.purple : null};
  border-top-left-radius: ${({ pos, theme }) =>
    pos === 'left' ? theme.radius.small : null};
  border-top-right-radius: ${({ pos, theme }) =>
    pos === 'right' ? theme.radius.small : null};
  border-bottom-left-radius: ${({ pos, theme }) =>
    pos === 'left' ? theme.radius.small : null};
  border-bottom-right-radius: ${({ pos, theme }) =>
    pos === 'right' ? theme.radius.small : null};
  height: 50px;
  position: sticky;
  top: 50px;
  background-color: ${({ theme }) => theme.colors.translucent.white};
`;

const ListItem = styled.li`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ isSelected }) => isSelected && 'bold'};
  ${({ isSelected, theme }) => isSelected && theme.fonts.IBMmedium};
  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.4)};
`;
