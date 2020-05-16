import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Avatar,
  Popper,
  Button,
  PopperProps,
  Popover,
  TextField
} from "@material-ui/core";
import { css } from "@emotion/core";
import { PRIMARY } from "utils/colors";
import { BoardMember, ITask } from "types";
import { Autocomplete } from "@material-ui/lab";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllMembers,
  selectMembersEntities
} from "features/member/MemberSlice";
import { patchTask } from "./TaskSlice";
import {
  modalPopperIndex,
  modalPopperAutocompleteIndex,
  modalPopperWidth
} from "const";
import AvatarOption from "components/AvatarOption";
import AvatarTag from "components/AvatarTag";
import Close from "components/Close";

const Container = styled.div`
  margin-bottom: 1rem;
`;

const ContentTitle = styled.h3`
  margin: 0.5rem 1rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: normal;
`;

const Content = styled.div`
  border-bottom: 1px solid #e1e4e8;
  padding: 8px 0;
  width: ${modalPopperWidth}px;
`;

const popperXSpacing = 16;

const AutocompletePopper = (props: PopperProps) => (
  <Popper
    {...props}
    style={{
      zIndex: modalPopperAutocompleteIndex,
      width: modalPopperWidth - popperXSpacing * 2
    }}
    placement="bottom-start"
  />
);

const Label = styled.p`
  color: #757575;
  margin: 0;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

interface Props {
  task: ITask;
}

const TaskAssignees = ({ task }: Props) => {
  const dispatch = useDispatch();
  const membersById = useSelector(selectMembersEntities);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pendingAssignees, setPendingAssignees] = useState<BoardMember[]>([]);
  const members = useSelector(selectAllMembers);
  const assignees = task.assignees.map(id => membersById[id]) as BoardMember[];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setPendingAssignees(assignees);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    const currentIds = assignees.map(a => a.id);
    const pendingIds = pendingAssignees.map(member => member.id);
    if (
      !(
        pendingIds.length === currentIds.length &&
        pendingIds
          .sort()
          .every((value, index) => value === currentIds.sort()[index])
      )
    ) {
      dispatch(
        patchTask({
          id: task.id,
          fields: { assignees: pendingIds }
        })
      );
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "task-assignees-popover" : undefined;

  return (
    <Container>
      <Label>Assignees</Label>
      {assignees.map(assignee => (
        <List key={assignee.id}>
          <div>
            <Avatar
              css={css`
                height: 2rem;
                width: 2rem;
                margin-right: 0.5rem;
              `}
              src={assignee.avatar?.photo}
              alt={assignee.avatar?.name}
            >
              {assignee.username.charAt(0)}
            </Avatar>
          </div>
          <div>{assignee.username}</div>
        </List>
      ))}
      <Button
        size="small"
        onClick={handleClick}
        data-testid="open-edit-assignees"
        css={css`
          color: ${PRIMARY};
          font-size: 0.7rem;
        `}
      >
        Change
      </Button>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        transitionDuration={0}
        style={{ zIndex: modalPopperIndex }}
        onClose={handleClose}
        css={css`
          .MuiPaper-rounded {
            border-radius: 0;
          }
        `}
      >
        <Content>
          <Close onClose={handleClose} onPopper />
          <ContentTitle>Assigned board members</ContentTitle>
          <Autocomplete
            multiple
            filterSelectedOptions
            disableClearable
            disableCloseOnSelect
            openOnFocus
            PopperComponent={AutocompletePopper}
            id="assignee-select"
            data-testid="edit-assignees"
            size="small"
            options={members}
            getOptionLabel={option => option.username}
            value={pendingAssignees}
            onChange={(_event, value) => setPendingAssignees(value)}
            renderOption={option => <AvatarOption option={option} />}
            renderInput={params => (
              <TextField
                {...params}
                autoFocus
                label="Assignees"
                variant="outlined"
              />
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
            css={css`
              padding: 1rem ${popperXSpacing}px;
            `}
          />
        </Content>
      </Popover>
    </Container>
  );
};

export default TaskAssignees;
