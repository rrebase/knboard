import React from "react";
import { ITask, Label } from "types";
import { useSelector } from "react-redux";
import LabelChip from "components/LabelChip";
import styled from "@emotion/styled";
import { selectLabelEntities } from "features/label/LabelSlice";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 4px;
`;

interface Props {
  task: ITask;
}

const TaskLabels = ({ task }: Props) => {
  const labelsById = useSelector(selectLabelEntities);
  const labels = task.labels.map((labelId) => labelsById[labelId]) as Label[];

  return (
    <Container>
      {labels.map((label) => (
        <LabelChip key={label.id} label={label} onCard />
      ))}
    </Container>
  );
};

export default TaskLabels;
