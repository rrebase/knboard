/* eslint-disable @typescript-eslint/camelcase */
/// <reference types="cypress" />
import * as keyCodes from "../../util";

context("Column", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.route("GET", "/api/boards/1/", "fixture:internals_board.json");
    cy.visit("/b/1/");
    cy.title().should("eq", "Internals | Knboard");
  });

  it("should edit column title if not empty & cancel via esc", () => {
    cy.fixture("internals_board").then((board) => {
      const colTitle = "In progress";
      const newColTitle = "Ongoing";
      const newColumn = board.columns.find((c) => c.id === 3);
      cy.route("PATCH", "/api/columns/3/", {
        ...newColumn,
        title: newColTitle,
      });

      cy.findAllByText(newColTitle).should("not.exist");
      cy.findByText(colTitle).should("be.visible");

      cy.findByTestId(`col-${colTitle}`).within(() => {
        cy.findAllByTestId("column-title-textarea").should("not.exist");
        cy.findByTestId("column-title").click();

        cy.findByTestId("column-title-textarea")
          .clear()
          .type("{enter}")
          .should("be.visible");

        cy.findByTestId("column-title-textarea").type(`${newColTitle}{enter}`);
        cy.findByTestId("column-title").should("be.visible");
      });
      cy.findAllByText(colTitle).should("not.exist");
      cy.findByText(newColTitle).should("be.visible");

      cy.findByTestId(`col-${newColTitle}`).within(() => {
        cy.findByTestId("column-title").click();
        cy.findByTestId("column-title-textarea").type("Cancelled title{esc}");
        cy.findAllByTestId("column-title-textarea").should("not.exist");
      });
      cy.findByText(newColTitle).should("be.visible");
    });
  });

  it("should add column", () => {
    const newColumn = {
      id: 5,
      title: "new column",
      tasks: [],
      column_order: 5,
      board: 1,
    };
    cy.route("POST", "/api/columns/", newColumn);
    cy.findByTestId("add-col").click();
    cy.findByTestId("board-container").scrollTo("right");
    cy.findByText(newColumn.title).should("be.visible");
  });

  it("should delete column", () => {
    const stub = cy.stub();
    stub.onFirstCall().returns(true);
    cy.on("window:confirm", stub);
    cy.fixture("internals_board").then((board) => {
      const columnToDelete = board.columns[0];
      cy.route("DELETE", `/api/columns/${columnToDelete.id}/`, "");

      cy.findByText(columnToDelete.title).should("be.visible");

      cy.findByTestId(`col-${columnToDelete.title}`).within(() => {
        cy.findByTestId("col-options").click();
      });
      cy.findByTestId("delete-column").click();

      cy.findAllByText(columnToDelete.title).should("not.exist");
    });
  });

  it("should move column successfully", () => {
    cy.route("POST", "/api/sort/column/", "").as("sortColumns");
    cy.expectColumns(["col-3", "col-1", "col-2", "col-4"]);

    cy.draggable("col-3")
      .focus()
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowRight, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.space, force: true })
      .then(() => {
        cy.wait("@sortColumns");
        cy.expectColumns(["col-1", "col-3", "col-2", "col-4"]);
      });
  });

  it("should revert column movement on error", () => {
    cy.route({
      method: "POST",
      url: "/api/sort/column/",
      status: 500,
      response: "",
    }).as("sortColumns");

    const columns = ["col-3", "col-1", "col-2", "col-4"];
    cy.expectColumns(columns);

    cy.draggable("col-3")
      .focus()
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowRight, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.space, force: true })
      .then(() => {
        cy.wait("@sortColumns");
        cy.expectColumns(columns);
      });
  });
});
