/// <reference types="cypress" />

context.skip("E2E Auth", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should login successfully", () => {
    cy.findByText(/login/i).click();
    cy.findByLabelText(/username/i).type("t@t.com");
    cy.findByLabelText(/password/i).type("test");
    cy.findByTestId("submit-login-btn").click();
  });

  it("should register", () => {
    cy.findByText(/register/i).click();
    cy.findByLabelText("Username").type("testuser");
    cy.findByLabelText("Email").type("testuser@gmail.com");
    cy.findByLabelText("Password").type("TestPw123");
    cy.findByLabelText("Confirm Password").type("TestPw123");
    cy.findByTestId("submit-register-btn").click();
  });
});
