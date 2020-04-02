/// <reference types="cypress" />

/* eslint-disable @typescript-eslint/camelcase */
context.skip("E2E Profile", () => {
  beforeEach(() => {
    cy.e2eLogin();
    cy.visit("/profile/");
  });

  it("should rename user", () => {
    cy.findByText("About").should("be.visible");
    cy.findByLabelText("Username")
      .clear()
      .type("newname");
    cy.findByText("Save").click();

    cy.findByText("User saved").should("be.visible");
    cy.findByLabelText("Username")
      .clear()
      .type("testuser");
    cy.findByText("Save").click();
  });
});
