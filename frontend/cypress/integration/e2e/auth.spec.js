/// <reference types="cypress" />
import { nanoid } from "@reduxjs/toolkit";

context.skip("Login Functional tests", () => {
  beforeEach(() => {
    // TODO: Seed the db with this user
    cy.wrap("t@t.com").as("username");
    cy.wrap("test").as("password");

    cy.visit("/");
    cy.findByText(/login/i).click();
  });

  it("should login successfully", function () {
    // pre: given user exists in db
    cy.findByLabelText(/username/i).type(this.username);
    cy.findByLabelText(/password/i).type(this.password);
    cy.findByTestId("submit-login-btn").click();
  });
});

context.skip("Register Functional tests", () => {
  beforeEach(() => {
    // pre: a user with given username or email doesn't exist in the db
    // nanoid() is a unique id added as a temp solution to achieve this condition
    cy.wrap("TestUser.123" + nanoid()).as("username");
    cy.wrap("testuser" + nanoid() + "@example.com").as("email");
    cy.wrap("SecretPw519").as("pw");
    cy.visit("/");
    cy.findByText(/register/i).click();
  });

  it("should successfully register via button click", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();
    cy.findByText("View Boards").should("be.visible");
  });

  it("should successfully register via enter key", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw + "{enter}");
    cy.findByText("View Boards").should("be.visible");
  });

  it("should require username", function () {
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();
    cy.findByText("This field is required").should("be.visible");
  });

  it("should not allow an invalid username", function () {
    cy.findByLabelText("Username").type("@.!");
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();
    cy.findByText(
      "Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters."
    ).should("be.visible");
  });

  it("should not allow a username longer than 150 characters", function () {
    cy.findByLabelText("Username").type(
      "Loremipsumdolorsitametconsecteturadipiscingel" +
        "itseddoeiusmodtemporincididuntutlaboreetdolor" +
        "emagnaaliqua.Utenimadminimveniamquisnostrudexercitationullamco"
    );
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();
    cy.findByText("Ensure this field has no more than 150 characters.").should(
      "be.visible"
    );
  });

  it("should require email", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();
    cy.findByText("This field is required.").should("be.visible");
  });

  it("should have a valid email", function () {
    const invalidEemail = "testemail-" + nanoid();

    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(invalidEemail);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();
    cy.findByText("Enter a valid email address.").should("be.visible");
  });

  it("should require password", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByTestId("submit-register-btn").click();
    cy.findByLabelText("Confirm Password").type(this.pw + "foo");
    cy.findByText("This field is required").should("be.visible");
  });

  it("should have a password with at least 8 characters in length", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type("aaabbbb");
    cy.findByLabelText("Confirm Password").type("aaabbbb");
    cy.findByTestId("submit-register-btn").click();
    cy.findByText(
      "This password is too short. It must contain at least 8 characters."
    ).should("be.visible");
  });

  it("should not have a common password", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type("password123");
    cy.findByLabelText("Confirm Password").type("password123");
    cy.findByTestId("submit-register-btn").click();
    cy.findByText("This password is too common.").should("be.visible");
  });

  it("should not have a password that only consists of number", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type("1234567890333222111");
    cy.findByLabelText("Confirm Password").type("1234567890333222111");
    cy.findByTestId("submit-register-btn").click();
    cy.findByText("This password is entirely numeric.").should("be.visible");
  });

  it("should not have a password with only spaces", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type("                   ");
    cy.findByLabelText("Confirm Password").type("                   ");
    cy.findByTestId("submit-register-btn").click();
    cy.findAllByText("This field may not be blank.").should("be.visible");
  });

  it("should require confirm password", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type("TestPw123-Foo");

    cy.findByTestId("submit-register-btn").click();
    cy.findByText("The two password fields didn't match.").should("be.visible");
  });

  it("should have password and confirm password match", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type("TestPw123-Foo");
    cy.findByTestId("submit-register-btn").click();
    cy.findByText("The two password fields didn't match.").should("be.visible");
  });

  it("should not register if another user with this username already exists", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();

    // Back to main page
    cy.findByTestId("user-menu").click();
    cy.findByText("Logout").click();
    cy.visit("/");

    cy.findByText(/register/i).click();
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type("other" + this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();

    cy.findByText("A user with that username already exists.").should(
      "be.visible"
    );
  });

  it("should not register if another user with this email already exists", function () {
    cy.findByLabelText("Username").type(this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();

    // Back to main page
    cy.findByTestId("user-menu").click();
    cy.findByText("Logout").click();
    cy.visit("/");

    cy.findByText(/register/i).click();
    cy.findByLabelText("Username").type("other" + this.username);
    cy.findByLabelText("Email").type(this.email);
    cy.findByLabelText("Password").type(this.pw);
    cy.findByLabelText("Confirm Password").type(this.pw);
    cy.findByTestId("submit-register-btn").click();

    cy.findByText(
      "A user is already registered with this e-mail address."
    ).should("be.visible");
  });
});
