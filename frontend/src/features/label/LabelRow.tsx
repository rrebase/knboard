import React, { useState } from "react";
import styled from "@emotion/styled";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { patchLabel, deleteLabel } from "./LabelSlice";
import { css } from "@emotion/core";
import { Label } from "types";
import { useForm, FormContext } from "react-hook-form";
import { borderRadius } from "const";
import Flex from "components/Flex";
import LabelFields from "./LabelFields";
import LabelChip from "components/LabelChip";

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
    mode: "onChange",
  });

  const onSubmit = methods.handleSubmit(({ name, color }) => {
    if (detail) {
      dispatch(
        patchLabel({ id: label.id, fields: { name, color, board: detail.id } })
      );
      setEditing(false);
    }
  });

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure? Deleting a label will remove it from all tasks."
      )
    ) {
      dispatch(deleteLabel(label.id));
    }
  };

  return (
    <RowDiv data-testid={`row-${label.id}`}>
      <Flex
        css={css`
          ${editing && "margin-bottom: 1rem;"}
          transition: all 0.1s ease-in-out;
        `}
      >
        <LabelChip label={label} />
        <Flex>
          {!editing && (
            <Button
              size="small"
              onClick={() => setEditing(true)}
              css={css`
                margin-left: 0.5rem;
                font-size: 0.675rem;
              `}
            >
              Edit
            </Button>
          )}
          <Button
            size="small"
            onClick={handleDelete}
            css={css`
              margin-left: 0.5rem;
              font-size: 0.675rem;
            `}
          >
            Delete
          </Button>
        </Flex>
      </Flex>
      <FormContext {...methods}>
        {editing && (
          <LabelFields
            fieldsId={label.id.toString()}
            onSubmit={onSubmit}
            setActive={setEditing}
          />
        )}
      </FormContext>
    </RowDiv>
  );
};

export default LabelRow;
