import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Avatar,
  Popper,
  Button,
  InputBase,
  PopperProps,
  Popover
} from "@material-ui/core";
import { css } from "@emotion/core";
import { PRIMARY } from "utils/colors";
import { BoardMember, ITask } from "types";
import { Autocomplete } from "@material-ui/lab";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { selectAllMembers } from "features/member/MemberSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { patchTask } from "./TaskSlice";
import {
  modalPopperIndex,
  modalPopperAutocompleteIndex,
  borderRadius,
  modalPopperWidth
} from "const";

const Container = styled.div`
  margin-bottom: 1rem;
`;

const ContentTitle = styled.h3`
  margin: 0.5rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: normal;
`;

const Content = styled.div`
  border-bottom: 1px solid #e1e4e8;
  padding: 8px 0;
  width: ${modalPopperWidth}px;
`;

const AutocompletePopper = (props: PopperProps) => (
  <Popper
    {...props}
    style={{ zIndex: modalPopperAutocompleteIndex, width: modalPopperWidth }}
    placement="bottom-start"
    css={css`
      .MuiPaper-rounded {
        border-radius: 0;
      }

      .MuiAutocomplete-option {
        &[data-focus="true"] {
          background-color: rgba(0, 0, 0, 0.04) !important;
        }
        &[aria-selected="true"] {
          background-color: initial;
        }
      }
    `}
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

const Option = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ccc;
  p {
    display: block;
    color: #333;
    margin: 4px 12px;
  }
`;

interface Props {
  task: ITask;
}

// I don't really like the way this component behaves with focus
// TODO: Use a chip based approach like it's done it CreateTaskDialog
const TaskAssignees = ({ task }: Props) => {
  const dispatch = useDispatch();
  const membersById = useSelector((state: RootState) => state.member.entities);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [pendingAssignees, setPendingAssignees] = useState<BoardMember[]>([]);
  const members = useSelector(selectAllMembers);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const assignees = task.assignees.map(id => membersById[id]!);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setPendingAssignees(assignees);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    dispatch(
      patchTask({
        id: task.id,
        fields: { assignees: pendingAssignees.map(member => member.id) }
      })
    );
    if (anchorEl) {
      anchorEl.focus();
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
          <div>{assignee?.username}</div>
        </List>
      ))}
      <Button
        size="small"
        onClick={handleClick}
        css={css`
          color: ${PRIMARY};
          font-size: 0.7rem;
        `}
      >
        + Add
      </Button>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        style={{ zIndex: modalPopperIndex }}
        onClose={handleClose}
        css={css`
          .MuiPaper-rounded {
            border-radius: 0;
          }
        `}
      >
        <Content>
          <ContentTitle>Assigned board members</ContentTitle>
          <Autocomplete
            open={open}
            multiple
            disableCloseOnSelect
            PopperComponent={AutocompletePopper}
            value={pendingAssignees}
            renderTags={() => null}
            onChange={(_, newValue) => setPendingAssignees(newValue)}
            noOptionsText="No members"
            renderOption={(option, { selected }) => (
              <Option>
                <div>
                  <Avatar
                    css={css`
                      height: 2rem;
                      width: 2rem;
                      margin-right: 0.5rem;
                    `}
                    src={option.avatar?.photo}
                    alt={option.avatar?.name}
                  >
                    {option.username.charAt(0)}
                  </Avatar>
                </div>
                <p>{option.username}</p>
                <div
                  css={css`
                    visibility: ${selected ? "visibile" : "hidden"};
                  `}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </Option>
            )}
            options={members}
            getOptionLabel={option => option.username}
            renderInput={params => (
              <InputBase
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                placeholder="Search members"
                css={css`
                  width: 100%;
                  padding: 10px 0;
                  border-bottom: 1px solid #dfe2e5;
                  & input {
                    margin: 0 0.5rem;
                    border-radius: ${borderRadius}px;
                    border: 1px solid #ced4da;
                    font-size: 0.75rem;
                    padding: 6px 6px;
                    &:focus {
                      border-color: #1111ee;
                    }
                  }
                `}
              />
            )}
          />
        </Content>
      </Popover>
    </Container>
  );
};

export default TaskAssignees;
