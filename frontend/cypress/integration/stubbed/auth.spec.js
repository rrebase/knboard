/// <reference types="cypress" />

context("Stubbed Auth", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.visit("/boards/");
    cy.title().should("eq", "Boards | Knboard");
  });

  it("should show login view after clicking logout via user menu", () => {
    cy.findByTestId("user-menu").click();
    cy.findByText(/Logout/i).click();
    cy.findByTestId("open-login-btn").should("be.visible");
  });
});
