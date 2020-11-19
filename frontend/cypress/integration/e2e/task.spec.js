import * as keyCodes from "../../util";

context.skip("Task Functional tests", () => {
  beforeEach(() => {
    cy.visit("/");
    // TODO: Seed the db instead of using data generated for guest
    // pre: ALLOW_GUEST_ACCESS is set to True
    cy.wrap("Email verifications gives 500").as("taskTitle");
    cy.wrap("col-Backlog").as("firstColumn");
    cy.wrap("col-Requested").as("secondColumn");
    cy.findByText(/enter as a guest/i).click();
    cy.findByText(/view boards/i).click();
    cy.findByText(/project abydos/i).click();
  });

  it("should not move task with keyboard when escape pressed", function () {
    cy.findByText(this.taskTitle)
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowRight, force: true })
      .trigger("keydown", { keyCode: keyCodes.arrowDown, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.escape, force: true });
    cy.findByTestId(this.firstColumn).within(() => {
      cy.findByText(this.taskTitle).should("be.visible");
    });
  });

  it("should not move task with keyboard when it's already in leftmost column", function () {
    cy.findByText(this.taskTitle)
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowLeft, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.space, force: true });
    cy.findByTestId(this.firstColumn).within(() => {
      cy.findByText(this.taskTitle).should("be.visible");
    });
  });

  it("should move task with keyboard in the same column", function () {
    cy.findByText(this.taskTitle)
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowDown, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.space, force: true });
    cy.findByTestId(this.firstColumn).within(() => {
      cy.findByText(this.taskTitle).should("be.visible");
    });
  });

  it("should move task with keyboard to a different column", function () {
    cy.findByText(this.taskTitle)
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowRight, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.space, force: true });
    cy.findByTestId(this.secondColumn).within(() => {
      cy.findByText(this.taskTitle).should("be.visible");
    });
  });
});
