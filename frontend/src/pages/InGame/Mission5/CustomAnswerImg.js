import React from 'react';
import styled from 'styled-components';

const CustomAnswerImg = ({ color, direction }) => {
  return (
    // <Wrapper>
    <StyledSvg
      preserveAspectRatio="xMaxYMax meet"
      color={color}
      direction={direction}
      viewBox="0 0 496.64 468.21"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="handSVG"
        d="M271.48,467.33c-85.21,8.89-183.75-51.14-198.78-119.12-7.18-32.47-55.47-50.54-68.44-78.49-14.59-31.47,10.64-66.28,40.09-66.28,33.57,0,65.51,55.44,52.48,15.11-12.5-46.15-28.6-91.6-37.89-138.47-4.05-40.67,46.44-63.66,75.29-35.34,15.79,5.26,45.43,147.08,53.11,119.16C199.29,111.82,158.19,16.38,229.48,0c79.22,3.21,39.34,108.45,50.16,159.31,12.95,9.75,15.87-66.83,21.97-79.55-3.95-51.5,58.62-97.31,91.89-44.82,16.25,50.13-63.46,245,25.49,91.27,14.26-27.32,46.37-31.93,67.93-10.36,35.39,51.39-36.3,107.98-50.79,158.6,2.03,99.92-54.83,188.43-164.66,192.87Z"
      />
    </StyledSvg>
    //</Wrapper>
  );
};

export default CustomAnswerImg;

// const Wrapper = styled.div`
//   z-index: 300;
//   position: absolute;
// `;

const StyledSvg = styled.svg`
  z-index: 300;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  fill: ${({ color }) => color};
  transform: ${({ direction }) =>
    direction === 'left' ? 'rotateY(180deg)' : 'rotateY(0deg)'};
`;
