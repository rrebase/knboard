/// <reference types="cypress" />

context.skip("E2E Register", () => {
  beforeEach(() => {
    cy.visit("/");
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
