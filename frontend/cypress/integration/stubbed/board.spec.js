/* eslint-disable @typescript-eslint/camelcase */
/// <reference types="cypress" />
import * as keyCodes from "../../util";

context("Board List", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.route("GET", "/api/boards/", "fixture:board_list.json");
    cy.visit("/boards/");
    cy.title().should("eq", "Boards | Knboard");
  });

  it("should have list of boards and create new board", () => {
    cy.findByText("All Boards").should("be.visible");

    cy.findByText("Internals").should("be.visible");
    cy.findByText("Operating Systems").should("be.visible");
    cy.findByText("Fundamentals of Computation").should("be.visible");
    cy.findByText("Data Science").should("be.visible");

    cy.route("POST", "/api/boards/", "fixture:board_create.json");
    cy.findByText(/Create new board/i).click();
    cy.findByText(/^Create board$/i).click();
    cy.findByText("This field is required").should("be.visible");
    cy.findByLabelText("Board name").type("Physics");
    cy.findByTestId("create-board-btn").click();

    cy.findByText("Physics").should("be.visible");
  });
});

context("Board Detail (Member)", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.route("GET", "/api/boards/2/", "fixture:os_board.json");
    cy.visit("/b/2/");
    cy.title().should("eq", "Operating Systems | Knboard");
  });

  it("should not see owner specific member invite & remove buttons", () => {
    cy.findAllByTestId("member-invite").should("not.exist");

    cy.findByTestId("member-2").click();
    cy.findByText("Owner of this board").should("be.visible");
    cy.findAllByText(/Remove from board/i).should("not.exist");
    cy.closeDialog();

    cy.findByTestId("member-1").click();
    cy.findByText("Owner of this board").should("not.exist");
    cy.findAllByText(/Remove from board/i).should("not.exist");
  });
  it("should not edit board name", () => {
    cy.findByText("Operating Systems").should("be.visible");
    cy.findByTestId("board").within(() => {
      cy.findByTestId("board-name").click();
      cy.findAllByTestId("board-name-textarea").should("not.exist");
    });
  });
});

context("Board Detail (Owner)", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.route("GET", "/api/boards/1/", "fixture:internals_board.json");
    cy.visit("/b/1/");
    cy.title().should("eq", "Internals | Knboard");
  });

  it("should edit board name if not empty & cancel via esc", () => {
    cy.fixture("internals_board").then((board) => {
      const boardName = "Internals";
      const newBoardName = "Internals Updated";
      const newBoard = board;
      cy.route("PATCH", "/api/boards/1/", {
        ...newBoard,
        name: newBoardName,
      });

      cy.findAllByText(newBoardName).should("not.exist");
      cy.findByText(boardName).should("be.visible");

      cy.findByTestId("board").within(() => {
        cy.findAllByTestId("board-name-textarea").should("not.exist");
        cy.findByTestId("board-name").click();

        cy.findByTestId("board-name-textarea")
          .clear()
          .type("{enter}")
          .should("be.visible");

        cy.findByTestId("board-name-textarea").type(`${newBoardName}{enter}`);
        cy.findByTestId("board-name").should("be.visible");
      });
      cy.findAllByText(boardName).should("not.exist");
      cy.findByText(newBoardName).should("be.visible");

      cy.findByTestId("board").within(() => {
        cy.findByTestId("board-name").click();
        cy.findByTestId("board-name-textarea").type("Cancelled name{esc}");
        cy.findAllByTestId("board-name-textarea").should("not.exist");
      });
      cy.findByText(newBoardName).should("be.visible");

    });
  });

  it("should have all columns and tasks", () => {
    cy.findByText("Internals").should("be.visible");

    const colTitle1 = "In progress";
    cy.findByText(colTitle1).should("be.visible");
    cy.findByTestId(`col-${colTitle1}`)
      .children()
      .should("contain", "Cookie Consent")
      .should("contain", "User settings");

    const colTitle2 = "Backlog";
    cy.findByText(colTitle2).should("be.visible");
    cy.findByTestId(`col-${colTitle2}`)
      .children()
      .should("contain", "Implement Landing page")
      .should("contain", "Profile page detail view");

    const colTitle3 = "Todo";
    cy.findByText(colTitle3).should("be.visible");
    cy.findByTestId(`col-${colTitle3}`)
      .children()
      .should("contain", "User friends");

    const colTitle4 = "Done";
    cy.findByText(colTitle4).should("be.visible");
  });

  it("should add new member", () => {
    const searchQuery = "ste";
    cy.route(
      "GET",
      `/api/u/search/?board=1&search=${searchQuery}`,
      "fixture:users.json"
    ).as("getUsers");
    cy.route("POST", "/api/boards/1/invite_member/", [
      {
        id: 2,
        username: "steveapple1",
        email: "steve@gmail.com",
        first_name: "Steve",
        last_name: "Apple",
      },
    ]).as("inviteSteve");

    cy.findByTestId("member-invite").click();
    cy.get("#user-search").focus().type(searchQuery);
    cy.wait("@getUsers");
    cy.get("#user-search")
      .trigger("keydown", { keyCode: keyCodes.arrowDown })
      .trigger("keydown", { keyCode: keyCodes.enter });

    cy.findByTestId("invite-selected").click();
    cy.wait("@inviteSteve");
    cy.findByText("Invited steveapple1");
    cy.expectMembers(["3", "2", "1"]);
  });

  it("should remove member unless owner", () => {
    cy.route("POST", "/api/boards/1/remove_member/", {
      id: 3,
      username: "daveice",
      email: "dave@ice.com",
    }).as("removeDave");

    cy.findByTestId("member-1").click();

    cy.findByText("Owner of this board").should("be.visible");
    cy.closeDialog();

    cy.findByTestId("member-3").click();
    cy.findByText(/Remove from board/i).click();
    cy.findByText(/Remove member/i).click();

    cy.wait("@removeDave");
    cy.findByText("Removed daveice").should("be.visible");
  });

  it("should delete a label from all tasks", () => {
    cy.fixture("internals_board").then((board) => {
      const labelToDelete = board.labels[2];
      cy.route("DELETE", `/api/labels/${labelToDelete.id}/`, "").as(
        "deleteLabel"
      );
      cy.findByText(labelToDelete.name).should("be.visible");
      cy.findByText(/Edit labels/i).click();
      cy.findByTestId(`row-${labelToDelete.id}`).within(() => {
        cy.findByText(/Delete/i).click();
      });
      cy.wait("@deleteLabel").then(() => {
        cy.findByTestId("close-dialog").click();
        cy.findByText(labelToDelete.name).should("not.be.visible");
      });
    });
  });

  it("should filter assignees", () => {
    cy.fixture("internals_board").then((board) => {
      const member = board.members[0];
      cy.route(
        "GET",
        `/api/boards/1/?assignees=${member.id}`,
        "fixture:internals_board"
      ).as("getFilteredBoard");

      cy.route(
        "GET",
        `/api/boards/1/?assignees=`,
        "fixture:internals_board"
      ).as("getBoard");

      cy.findByTestId("member-filter").click();
      cy.get(".MuiAutocomplete-popper").within(() => {
        cy.findByText(member.username).click();
      });
      cy.findByTestId("filter-selected").click();
      cy.wait("@getFilteredBoard");
      cy.findByTestId("clear-filter").should("be.visible");

      cy.findByTestId("clear-filter").click();
      cy.findByTestId("clear-filter").should("not.be.visible");
      cy.wait("@getBoard");

      cy.findByTestId("member-filter").click();
      cy.get(".MuiAutocomplete-popper").within(() => {
        cy.findByText(member.username).should("have.value", "");
      });
    });
  });
});
