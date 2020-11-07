import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Button, Popover, Box } from "@material-ui/core";
import AssigneeAutoComplete from "components/AssigneeAutoComplete";
import { fetchBoardById } from "features/board/BoardSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoardMember } from "types";
import { selectAllMembers } from "./MemberSlice";

const FilterButton = styled.div`
  margin-left: 0.5rem;
  border-color: #d1d8e2;
  border-radius: 12px;
`;

const Content = styled.div`
  padding: 2rem;
  width: 300px;
`;

const Description = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: bold;
  font-size: 0.875rem;
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
          <Description>Filter tasks by assignees</Description>
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}>
              <AssigneeAutoComplete
                assignee={filteredAssignee}
                members={members}
                controlId={"assignee-filter"}
                dataTestId={"filter-assignees"}
                setAssignee={setFilteredAssignee}
              />
            </Box>
            <Button
              color="primary"
              variant="contained"
              css={css`
                font-size: 0.625rem;
                margin-left: 0.5rem;
              `}
              onClick={handleClickFilter}
              data-testid="filter-selected"
              disabled={filteredAssignee.length === 0}
            >
              Filter
            </Button>
          </Box>
        </Content>
      </Popover>
    </>
  );
};

export default MemberFilter;
