import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Button } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { RootState } from "store";
import { clearToast } from "./ToastSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/core";
import { TOAST_AUTO_HIDE_DURATION } from "const";

const Toast = () => {
  const dispatch = useDispatch();

  const open = useSelector((state: RootState) => state.toast.open);
  const message = useSelector((state: RootState) => state.toast.message);
  const severity = useSelector((state: RootState) => state.toast.severity);

  let timer: ReturnType<typeof setTimeout>;

  function handleClose() {
    dispatch(clearToast());
  }

  useEffect(() => {
    if (open) {
      timer = setTimeout(() => {
        handleClose();
      }, TOAST_AUTO_HIDE_DURATION);
    }
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Snackbar open={open}>
      <Alert
        severity={severity}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={handleClose}
            data-testid="toast-close"
            css={css`
              min-width: 0;
            `}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
