import React from "react";
import { Helmet, HelmetProps } from "react-helmet";

const SEO = ({ title }: Pick<HelmetProps, "title">) => (
  <Helmet title={title} titleTemplate="%s | Knboard" defaultTitle="Knboard" />
);

export default SEO;
