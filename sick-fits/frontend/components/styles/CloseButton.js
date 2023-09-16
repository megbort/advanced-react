import styled from 'styled-components';

const CloseButton = styled.button`
  background: black;
  color: white;
  font-size: 2.5rem;
  border: 2px solid black;
  margin-right: 1rem;
  position: absolute;
  z-index: 2;
  right: 10px;
  height: 51px;
  width 40px;

  &:hover {
    cursor: pointer;
    color: black;
    background: white;
    border: 2px solid black;
  }
`;

export default CloseButton;
