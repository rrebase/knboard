import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button
} from "@material-ui/core";
import { newCardStyles } from "./BoardList";
import { useDispatch, useSelector } from "react-redux";
import { createBoard, setCreateDialogOpen } from "./BoardSlice";
import { RootState } from "store";

const NewBoardDialog = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.board.createDialogOpen);
  const [name, setName] = React.useState<string>("");

  const handleOpen = () => {
    setName("");
    dispatch(setCreateDialogOpen(true));
  };

  const handleClose = () => {
    dispatch(setCreateDialogOpen(false));
  };

  const handleCreate = () => {
    dispatch(createBoard(name));
  };

  return (
    <div>
      <Button css={newCardStyles} onClick={handleOpen}>
        Create new board
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="new-board"
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle id="new-board-title">New board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new private board. Only members of the board will be able
            to see and edit it.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="board-name"
            label="Board name"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCreate}
            color="primary"
            disabled={name === ""}
            data-testid="create-board-btn"
          >
            Create Board
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewBoardDialog;
