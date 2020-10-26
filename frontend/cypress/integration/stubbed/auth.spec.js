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

context("Stubbed Auth User Not Logged In", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.title().should("eq", "Knboard");
  });

  it("should not register if no email entered", () => {
    cy.findByText(/register/i).click();
    cy.findByLabelText("Username").type("testuser");
    cy.get("p[id='email-helper-text']").should("not.exist");
    cy.findByLabelText("Password").type("TestPw123");
    cy.findByLabelText("Confirm Password").type("TestPw123");
    cy.findByTestId("submit-register-btn").click();
    cy.wait(500);
    cy.get("p[id='email-helper-text']")
      .should("be.visible")
      .should("have.text", "This field is required.");
  });
});
