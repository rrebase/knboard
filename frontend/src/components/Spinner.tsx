import React from "react";
import { Fade, CircularProgress } from "@material-ui/core";

interface Props {
  loading: boolean;
}

const Spinner = ({ loading }: Props) => (
  <Fade
    in={loading}
    style={{
      transitionDelay: loading ? "800ms" : "0ms"
    }}
    unmountOnExit
  >
    <CircularProgress />
  </Fade>
);

export default Spinner;
