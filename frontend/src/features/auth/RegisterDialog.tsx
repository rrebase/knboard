import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

const FormActions = styled.div`
  margin-top: 1rem;
  text-align: right;
`;

interface FormData {
  username: string;
  password: string;
}

const RegisterDialog = () => {
  const { register, handleSubmit, errors } = useForm<FormData>();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = handleSubmit(({ username, password }) => {
    console.log(username, password);
  });

  return (
    <>
      <Button
        variant="contained"
        css={css`
          background-color: #f1f2f7;
          margin-left: 0.5rem;
          color: #434449;
          &:hover {
            background-color: #e2e3e6;
          }
        `}
        onClick={handleOpen}
      >
        Register
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="register-dialog-title"
        css={css`
          & .MuiDialog-paper {
            padding: 2rem 1.5rem;
          }
        `}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="register-dialog-title">Register</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              name="username"
              margin="dense"
              id="username"
              label="Username"
              variant="outlined"
              inputRef={register({ required: true })}
              helperText={errors.username && "This field is required"}
              error={Boolean(errors.username)}
              fullWidth
            />
            <TextField
              name="password"
              margin="dense"
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              inputRef={register({ required: true })}
              helperText={errors.password && "This field is required"}
              error={Boolean(errors.password)}
              fullWidth
            />
            <FormActions>
              <Button variant="contained" color="primary" type="submit">
                Register
              </Button>
            </FormActions>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default RegisterDialog;
