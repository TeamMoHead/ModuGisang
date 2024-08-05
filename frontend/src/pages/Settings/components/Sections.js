import styled from 'styled-components';

export const Section = styled.div`
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 0.9em;
  margin-bottom: 10px;
`;

export const Text = styled.p`
  font-size: 0.8em;
  line-height: 1.6;

  margin-bottom: 30px;

  ul {
    margin-top: 5px;
    padding-left: 20px;

    li {
      list-style-type: disc;
    }
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  text-align: left;
`;
