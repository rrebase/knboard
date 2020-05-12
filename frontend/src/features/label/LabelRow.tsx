import React, { useState } from "react";
import styled from "@emotion/styled";
import { Chip, Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { patchLabel } from "./LabelSlice";
import { css } from "@emotion/core";
import { Label } from "types";
import { getContrastColor } from "utils/colors";
import { useForm, FormContext } from "react-hook-form";
import { borderRadius } from "const";
import Flex from "components/Flex";
import LabelFields from "./LabelFields";

const RowDiv = styled.div`
  padding: 0.5rem;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  &:first-of-type {
    border-top-left-radius: ${borderRadius}px;
    border-top-right-radius: ${borderRadius}px;
  }
  &:last-of-type {
    border-bottom: 1px solid #ccc;
    border-bottom-left-radius: ${borderRadius}px;
    border-bottom-right-radius: ${borderRadius}px;
  }
`;

interface RowProps {
  label: Label;
}

interface DialogFormData {
  name: string;
  color: string;
}

const LabelRow = ({ label }: RowProps) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const detail = useSelector((state: RootState) => state.board.detail);
  const methods = useForm<DialogFormData>({
    defaultValues: { name: label.name, color: label.color },
    mode: "onChange"
  });

  const onSubmit = methods.handleSubmit(({ name, color }) => {
    if (detail) {
      dispatch(
        patchLabel({ id: label.id, fields: { name, color, board: detail.id } })
      );
      setEditing(false);
    }
  });

  return (
    <RowDiv>
      <Flex
        css={css`
          ${editing && "margin-bottom: 1rem;"}
          transition: all 0.1s ease-in-out;
        `}
      >
        <Chip
          variant="outlined"
          css={css`
            background-color: ${label.color};
            color: ${getContrastColor(label.color)};
            .MuiChip-label {
              font-weight: bold;
            }
          `}
          label={label.name}
        />
        {!editing && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        )}
      </Flex>
      <FormContext {...methods}>
        {editing && <LabelFields onSubmit={onSubmit} setActive={setEditing} />}
      </FormContext>
    </RowDiv>
  );
};

export default LabelRow;
