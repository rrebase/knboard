import React from "react";
import styled from "@emotion/styled";
import { Button, TextField, IconButton, useTheme } from "@material-ui/core";
import { css } from "@emotion/core";
import {
  TASK_G,
  getContrastColor,
  getRandomHexColor,
  DANGER,
  BLACK,
} from "utils/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import Flex from "components/Flex";
import { useFormContext } from "react-hook-form";

const Actions = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  fieldsId: string;
  onSubmit: () => void;
  setActive: (active: boolean) => void;
}

const LabelFields = ({ fieldsId, onSubmit, setActive }: Props) => {
  const theme = useTheme();
  const {
    register,
    setValue,
    triggerValidation,
    watch,
    errors,
  } = useFormContext();

  const setRandomColor = () => {
    setValue("color", getRandomHexColor());
    triggerValidation();
  };
  const pendingColor = watch("color");

  return (
    <Flex
      css={css`
        ${theme.breakpoints.down("xs")} {
          flex-direction: column;
        }
      `}
    >
      <div
        css={css`
          display: flex;
          ${theme.breakpoints.down("xs")} {
            margin-bottom: 1rem;
          }
        `}
      >
        <TextField
          id={`${fieldsId}label-name`}
          autoFocus
          size="small"
          label="Label name"
          variant="outlined"
          name="name"
          inputRef={register({ required: true })}
          error={Boolean(errors.name)}
          css={css`
            margin-right: 1rem;
          `}
        />
        <IconButton
          size="small"
          onClick={setRandomColor}
          data-testid="random-color"
          css={css`
            height: 2.25rem;
            width: 2.25rem;
            color: ${TASK_G};
            padding: 0.75rem;
            margin-right: 0.5rem;
            background-color: ${pendingColor};
            color: ${Boolean(errors.color)
              ? DANGER
              : getContrastColor(pendingColor)};
            border: ${getContrastColor(pendingColor) === BLACK &&
            "1px solid #ccc"};
            &:hover {
              background-color: ${pendingColor};
            }
            font-size: 0.825rem;
          `}
        >
          <FontAwesomeIcon icon={faRedoAlt} size="sm" />
        </IconButton>
        <TextField
          id={`${fieldsId}label-color`}
          size="small"
          label="Color"
          variant="outlined"
          name="color"
          inputRef={register({
            pattern: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
          })}
          error={Boolean(errors.color)}
          css={css`
            width: 90px;
            .MuiInputBase-input {
              font-family: monospace;
            }
          `}
        />
      </div>
      <Actions>
        <Button
          onClick={() => setActive(false)}
          css={css`
            margin: 0 0.5rem;
            font-size: 0.625rem;
          `}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          css={css`
            font-size: 0.625rem;
          `}
        >
          Save
        </Button>
      </Actions>
    </Flex>
  );
};

export default LabelFields;
