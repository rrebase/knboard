import React, { useState } from "react";
import {
  Dialog,
  TextField,
  InputAdornment,
  Avatar,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllMembers,
  setMemberListOpen,
  setDialogMember,
} from "./MemberSlice";
import { RootState } from "store";
import styled from "@emotion/styled";
import Flex from "components/Flex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@emotion/core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { avatarStyles } from "styles";
import Close from "components/Close";

const Container = styled.div`
  height: 500px;
`;

const LabelCount = styled.h3`
  color: #333;
  margin: 0 0 1rem 0;
`;

const Table = styled.div`
  margin: 1rem 2rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 3rem;
`;

const MemberListDialog = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const open = useSelector((state: RootState) => state.member.memberListOpen);
  const [searchValue, setSearchValue] = useState("");
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));

  const filteredMembers = members.filter((member) =>
    member.username.toLowerCase().match(searchValue.trim().toLowerCase())
  );

  const handleClose = () => {
    dispatch(setMemberListOpen(false));
    setSearchValue("");
  };

  const handleClick = (memberId: number) => {
    dispatch(setDialogMember(memberId));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={xsDown}
    >
      <Container>
        <Close onClose={handleClose} />
        <DialogTitle id="edit-labels">Board members</DialogTitle>
        <Flex
          css={css`
            margin: 1.5rem 2rem 0rem 2rem;
            ${theme.breakpoints.down("xs")} {
              flex-direction: column;
            }
          `}
        >
          <LabelCount>
            {filteredMembers.length} member{filteredMembers.length !== 1 && "s"}{" "}
          </LabelCount>
          <div>
            <TextField
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search members"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    css={css`
                      color: #ccc;
                    `}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Flex>
        <Table>
          {filteredMembers.map((member) => (
            <Row key={member.id}>
              <Avatar
                css={css`
                  ${avatarStyles}
                  &:hover {
                    cursor: pointer;
                  }
                  margin-right: 0.5rem;
                `}
                onClick={() => handleClick(member.id)}
                data-testid={`member-${member.id}`}
                src={member?.avatar?.photo}
                alt={member?.avatar?.name}
              >
                {member.username.charAt(0)}
              </Avatar>
              <div>{member.username}</div>
            </Row>
          ))}
        </Table>
      </Container>
    </Dialog>
  );
};

export default MemberListDialog;
