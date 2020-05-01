/* eslint-disable @typescript-eslint/no-var-requires */
/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);
  on(
    "file:preprocessor",
    require("@cypress/code-coverage/use-browserify-istanbul")
  );
  return config;
};
