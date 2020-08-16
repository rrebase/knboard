import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React from "react";
import { BoardMember } from "types";
import AvatarOption from "./AvatarOption";
import AvatarTag from "./AvatarTag";

interface Props {
  controlId: string;
  dataTestId: string;
  members: BoardMember[];
  assignee: BoardMember[];
  setAssignee: (assignees: BoardMember[]) => void;
}

const AssigneeAutoComplete = ({
  controlId,
  dataTestId,
  members,
  assignee,
  setAssignee,
}: Props) => {
  return (
    <Autocomplete
      multiple
      openOnFocus
      filterSelectedOptions
      disableClearable
      disableCloseOnSelect
      id={controlId}
      data-testid={dataTestId}
      size="small"
      options={members}
      getOptionLabel={(option) => option.username}
      value={assignee}
      onChange={(_event, value) => setAssignee(value)}
      renderOption={(option) => <AvatarOption option={option} />}
      renderInput={(params) => (
        <TextField {...params} autoFocus label="Assignees" variant="outlined" />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <AvatarTag
            key={option.id}
            option={option}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};

export default AssigneeAutoComplete;
