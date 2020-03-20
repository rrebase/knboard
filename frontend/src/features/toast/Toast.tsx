import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { RootState } from "store";
import { clearToast } from "./ToastSlice";

const Toast = () => {
  const dispatch = useDispatch();

  const open = useSelector((state: RootState) => state.toast.open);
  const message = useSelector((state: RootState) => state.toast.message);
  const severity = useSelector((state: RootState) => state.toast.severity);

  function handleClose() {
    dispatch(clearToast());
  }

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
