import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { register as registerUser, clearErrors } from "./AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import Close from "components/Close";

const FormActions = styled.div`
  margin-top: 1rem;
  text-align: right;
`;

interface FormData {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

const RegisterDialog = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, errors, setError } = useForm<FormData>();
  const apiErrors = useSelector(
    (state: RootState) => state.auth.registerErrors
  );
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (apiErrors) {
      for (const errorKey in apiErrors) {
        // @ts-ignore
        setError(errorKey, "api_error", apiErrors[errorKey]);
      }
    }
  }, [apiErrors]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(clearErrors());
  };

  const onSubmit = handleSubmit((fields) => {
    dispatch(registerUser(fields));
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
        data-testid="open-register-btn"
        onClick={handleOpen}
      >
        Register
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        keepMounted={false}
        aria-labelledby="register-dialog-title"
        css={css`
          & .MuiDialog-paper {
            padding: 2rem 1.5rem;
          }
        `}
        maxWidth="xs"
        fullWidth
      >
        <Close onClose={handleClose} />
        <DialogTitle id="register-dialog-title">Register</DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            {apiErrors?.non_field_errors && (
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
            )}
            <TextField
              autoFocus
              id="username"
              name="username"
              margin="dense"
              label="Username"
              variant="outlined"
              inputRef={register({ required: "This field is required" })}
              helperText={errors.username?.message}
              error={Boolean(errors.username)}
              fullWidth
            />
            <TextField
              id="email"
              name="email"
              margin="dense"
              label="Email"
              variant="outlined"
              inputRef={register()}
              helperText={errors.email?.message}
              error={Boolean(errors.email)}
              fullWidth
            />
            <TextField
              id="password1"
              name="password1"
              margin="dense"
              label="Password"
              variant="outlined"
              type="password"
              inputRef={register({ required: "This field is required" })}
              helperText={errors.password1?.message}
              error={Boolean(errors.password1)}
              fullWidth
            />
            <TextField
              id="password2"
              name="password2"
              margin="dense"
              label="Confirm Password"
              variant="outlined"
              type="password"
              inputRef={register({ required: "This field is required" })}
              helperText={errors.password2?.message}
              error={Boolean(errors.password2)}
              fullWidth
            />
            <FormActions>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                data-testid="submit-register-btn"
              >
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
