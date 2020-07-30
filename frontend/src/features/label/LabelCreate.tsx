import React from "react";
import LabelFields from "./LabelFields";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { useForm, FormProvider } from "react-hook-form";
import { createLabel, selectAllLabels } from "./LabelSlice";
import { getRandomHexColor } from "utils/colors";
import styled from "@emotion/styled";
import { ErrorOption } from "react-hook-form/dist/types/form";

const Container = styled.div`
  margin: 0 0.5rem;
`;

interface Props {
  setCreating: (creating: boolean) => void;
}

interface DialogFormData {
  name: string;
  color: string;
}

const LabelCreate = ({ setCreating }: Props) => {
  const dispatch = useDispatch();
  const boardId = useSelector((state: RootState) => state.board.detail?.id);
  const labels = useSelector(selectAllLabels);
  const methods = useForm<DialogFormData>({
    defaultValues: { name: "", color: getRandomHexColor() },
    mode: "onChange",
  });

  const onSubmit = methods.handleSubmit(({ name, color }) => {
    if (labels.map((label) => label.name).includes(name)) {
      const errorOption: ErrorOption = {
        type: "createLabel",
        message: "Label already exists",
      };
      methods.setError("name", errorOption);
      return;
    }
    if (boardId) {
      dispatch(createLabel({ name, color, board: boardId }));
      setCreating(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <Container>
        <LabelFields
          fieldsId="create"
          onSubmit={onSubmit}
          setActive={setCreating}
        />
      </Container>
    </FormProvider>
  );
};

export default LabelCreate;
