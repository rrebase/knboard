import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Button, Popover, Box } from "@material-ui/core";
import AssigneeAutoComplete from "components/AssigneeAutoComplete";
import { fetchBoardById } from "features/board/BoardSlice";
import { createErrorToast } from "features/toast/ToastSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoardMember } from "types";
import { selectAllMembers } from "./MemberSlice";

const FilterButton = styled.div`
  margin-left: 0.5rem;
`;

const Content = styled.div`
  padding: 2rem;
`;

const Description = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: bold;
`;

interface Props {
  boardId: number;
}

const MemberFilter = ({ boardId }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredAssignee, setFilteredAssignee] = useState<BoardMember[]>([]);
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const postFilterMember = async (users: BoardMember[]) => {
    dispatch(
      fetchBoardById({
        boardId: boardId,
        assigneeIds: users.map((m) => m.id),
      })
    );
    handleClose();
  };

  const handleClickFilter = () => {
    postFilterMember(filteredAssignee);
  };

  const handleClickClearFilter = () => {
    setFilteredAssignee([]);
    postFilterMember([]);
  };

  const ClearFilterButton = () => (
    <FilterButton>
      <Button
        variant="outlined"
        size="small"
        css={css`
          text-transform: none;
        `}
        onClick={handleClickClearFilter}
        data-testid="clear-filter"
      >
        Clear Filters
      </Button>
    </FilterButton>
  );

  return (
    <>
      <FilterButton>
        <Button
          variant="outlined"
          size="small"
          css={css`
            text-transform: none;
          `}
          onClick={handleClick}
          aria-controls="member-filter-menu"
          aria-haspopup="true"
          data-testid="member-filter"
        >
          Filter
        </Button>
      </FilterButton>
      {filteredAssignee.length > 0 ? <ClearFilterButton /> : null}
      <Popover
        id="member-filter-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transitionDuration={0}
      >
        <Content>
          <Description>Filter Tasks by Assignees</Description>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box flexGrow={1} p={1}>
              <AssigneeAutoComplete
                assignee={filteredAssignee}
                members={members}
                controlId={"assignee-filter"}
                dataTestId={"filter-assignees"}
                setAssignee={setFilteredAssignee}
              />
            </Box>
            <Box>
              <Button
                color="primary"
                variant="contained"
                css={css`
                  margin-top: 0.75rem;
                  font-size: 0.625rem;
                `}
                onClick={handleClickFilter}
                data-testid="filter-selected"
                disabled={filteredAssignee.length === 0}
              >
                Filter
              </Button>
            </Box>
          </Box>
        </Content>
      </Popover>
    </>
  );
};

export default MemberFilter;
