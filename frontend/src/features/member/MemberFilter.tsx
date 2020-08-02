import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Button, Popover } from "@material-ui/core";
import UserSearch, { UserOption } from "components/UserSearch";
import { fetchBoardById } from "features/board/BoardSlice";
import { createErrorToast } from "features/toast/ToastSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  font-size: 18px;
  font-weight: bold;
`;

interface Props {
  boardId: number;
}

const MemberFilter = ({ boardId }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tagsValue, setTagsValue] = useState<UserOption[]>([]);
  const [filteredAssigneeIds, setFilteredAssigneeIds] = useState<number[]>([]);
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const postFilterMember = async (users: number[]) => {
    try {
      setFilteredAssigneeIds(users);
      dispatch(fetchBoardById({ boardId: boardId, assigneeIds: users }));
      handleClose();
    } catch (err) {
      dispatch(createErrorToast(err.toString()));
    }
  };

  const handleClickFilter = () => {
    postFilterMember(tagsValue.map((v) => v.id));
  };

  const handleClickClearFilter = () => {
    setTagsValue([]);
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
      {filteredAssigneeIds.length > 0 ? <ClearFilterButton /> : null}
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
          <Description>Filter board by assignees</Description>
          <UserSearch
            boardId={boardId}
            tagsValue={tagsValue}
            setTagsValue={setTagsValue}
            passedOptions={members}
          />
          <Button
            color="primary"
            variant="contained"
            css={css`
              margin-top: 0.75rem;
              font-size: 0.625rem;
            `}
            onClick={handleClickFilter}
            data-testid="filter-selected"
            disabled={tagsValue.length === 0}
          >
            Filter
          </Button>
        </Content>
      </Popover>
    </>
  );
};

export default MemberFilter;
