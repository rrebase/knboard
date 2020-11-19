context.skip("Board Functional tests", () => {
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

  it("should remove member from board as owner", function () {
    // pre: member-2 is the alice user created beforehand
    cy.findByTestId("member-2").click();
    cy.findByText(/remove from board/i).click();
    cy.findByText(/remove member/i).click();
    cy.findAllByTestId("member-2").should("not.exist");
  });
});
