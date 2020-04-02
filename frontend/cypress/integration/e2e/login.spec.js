/// <reference types="cypress" />

context("E2E Login", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should login successfully", () => {
    cy.findByText(/login/i).click();
    cy.findByLabelText(/username/i).type("t@t.com");
    cy.findByLabelText(/password/i).type("test");
    cy.findByTestId("submit-login-btn").click();
  });
});
