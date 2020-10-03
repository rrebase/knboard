/// <reference types="cypress" />

context("Profile", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.route("GET", "/api/users/1/", "fixture:testuser.json");
    cy.route("/api/avatars/", "fixture:avatars.json");
    cy.visit("/profile/");
    cy.title().should("eq", "Profile | Knboard");
  });

  it("should change username", () => {
    cy.route("PUT", "/api/users/1/", "fixture:testuser_update.json");
    cy.findByText("About").should("be.visible");
    cy.findByLabelText("Username").clear();
    cy.findByText("This field is required").should("be.visible");
    cy.findByLabelText("Username").type("newname");
    cy.findByText("Save").click();
    cy.findByText("User saved").should("be.visible");
  });

  it("should clear name fiels and update email", () => {
    cy.route("PUT", "/api/users/1/", "fixture:testuser_update.json");
    cy.findByLabelText("First name").clear();
    cy.findByLabelText("Last name").clear();
    cy.findByLabelText("Email").clear().type("newmail@gmail.com");
    cy.findByText("Save").click();
    cy.findByText("User saved").should("be.visible");
  });

  it("should change avatar", () => {
    cy.route("POST", "/api/users/1/update_avatar/", "fixture:dog_avatar.json");
    cy.findByTestId("change-avatar").click();
    cy.findByText("Pick an Avatar").should("be.visible");
    cy.findByTestId("avatar-dog").click();
    cy.findByTestId("close-avatar-picker").click({ force: true });
    cy.findByText("Avatar saved").should("be.visible");
    cy.get("img[alt='dog']").should("be.visible");
  });
});
