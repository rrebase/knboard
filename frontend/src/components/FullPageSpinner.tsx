import React from "react";
import { CircularProgress, Fade } from "@material-ui/core";

const FullPageSpinner = () => (
  <Fade style={{ transitionDelay: "800ms" }} unmountOnExit>
    <CircularProgress />
  </Fade>
);

export default FullPageSpinner;
