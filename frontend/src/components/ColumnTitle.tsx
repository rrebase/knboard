import styled from "@emotion/styled";
import { grid, borderRadius } from "const";
import { P100, PRIMARY } from "utils/colors";

export default styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  color: ${PRIMARY};
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  &:focus {
    outline: 2px solid ${P100};
    outline-offset: 2px;
  }

  textarea {
    color: ${PRIMARY};
    font-weight: bold;
    font-size: 20px;
    width: 100%;
    margin: 0 2rem 0 0.75rem;
    border: none;
    resize: none;
    &:focus {
      outline: none;
      border-radius: ${borderRadius}px;
      box-shadow: inset 0 0 0 2px ${PRIMARY};
    }
  }
`;
