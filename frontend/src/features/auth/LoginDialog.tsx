import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Grow,
} from "@material-ui/core";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { login, clearErrors } from "./AuthSlice";
import { RootState } from "store";
import { Alert } from "@material-ui/lab";
import Close from "components/Close";

const FormActions = styled.div`
  margin-top: 1rem;
  text-align: right;
`;

interface FormData {
  username: string;
  password: string;
}

const LoginDialog = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const apiErrors = useSelector((state: RootState) => state.auth.loginErrors);
  const loading = useSelector((state: RootState) => state.auth.loginLoading);
  const { register, handleSubmit, errors } = useForm<FormData>();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(clearErrors());
  };

  const onSubmit = handleSubmit(({ username, password }) => {
    dispatch(login({ username, password }));
  });

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        data-testid="open-login-btn"
      >
        Login
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted={false}
        aria-labelledby="login-dialog-title"
        css={css`
          & .MuiDialog-paper {
            padding: 2rem 1.5rem;
          }
        `}
        maxWidth="xs"
        fullWidth
      >
        <Close onClose={handleClose} />
        <DialogTitle id="login-dialog-title">Login</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            {apiErrors?.non_field_errors && (
              <Grow in timeout={100}>
                <Alert
                  severity="error"
                  css={css`
                    margin-bottom: 0.75rem;
                  `}
                >
                  {apiErrors.non_field_errors?.map((errorMsg) => (
                    <div key={errorMsg}>{errorMsg}</div>
                  ))}
                </Alert>
              </Grow>
            )}
            <TextField
              autoFocus
              name="username"
              margin="dense"
              id="username"
              label="Username"
              variant="outlined"
              inputRef={register({ required: "This field is required" })}
              helperText={errors.username?.message}
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
              inputRef={register({ required: "This field is required" })}
              helperText={errors.password?.message}
              error={Boolean(errors.password)}
              fullWidth
            />
            <FormActions>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                data-testid="submit-login-btn"
              >
                Login
              </Button>
            </FormActions>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default LoginDialog;
