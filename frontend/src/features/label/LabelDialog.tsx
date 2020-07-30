import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Dialog,
  Button,
  DialogTitle,
  TextField,
  InputAdornment,
  Hidden,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { setDialogOpen, selectAllLabels } from "./LabelSlice";
import { css } from "@emotion/core";
import Close from "components/Close";
import Flex from "components/Flex";
import LabelRow from "./LabelRow";
import LabelCreate from "./LabelCreate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  padding: 1rem;
  height: 500px;
`;

const LabelCount = styled.h3`
  color: #333;
  margin: 0 0 0 1rem;
`;

const Table = styled.div`
  margin: 1rem 0.5rem;
`;

const LabelDialog = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.label.dialogOpen);
  const labels = useSelector(selectAllLabels);
  const [searchValue, setSearchValue] = useState("");
  const [creating, setCreating] = useState(false);
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));

  const filteredLabels = labels.filter((label) =>
    label.name.toLowerCase().match(searchValue.trim().toLowerCase())
  );

  const handleClose = () => {
    dispatch(setDialogOpen(false));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={xsDown}
    >
      <Close onClose={handleClose} />
      <DialogTitle id="edit-labels">Edit labels</DialogTitle>
      <Container>
        <Flex
          css={css`
            align-items: flex-end;
            ${creating && "margin-bottom: 1rem;"}
          `}
        >
          <LabelCount>
            {filteredLabels.length} label{filteredLabels.length !== 1 && "s"}
          </LabelCount>
          <div>
            <Hidden xsDown implementation="css">
              <TextField
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search labels"
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
            </Hidden>
          </div>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() => setCreating(true)}
            css={css`
              margin-right: 1rem;
            `}
          >
            New label
          </Button>
        </Flex>
        {creating && <LabelCreate setCreating={setCreating} />}
        <Table>
          {filteredLabels.map((label) => (
            <LabelRow key={label.id + label.color + label.name} label={label} />
          ))}
        </Table>
      </Container>
    </Dialog>
  );
};

export default LabelDialog;
