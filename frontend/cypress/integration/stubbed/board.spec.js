/* eslint-disable @typescript-eslint/camelcase */
/// <reference types="cypress" />
import * as keyCodes from "../../util";

context("Board List", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.route("GET", "/api/boards/", "fixture:board_list.json");
    cy.visit("/boards/");
  });

  it("should have list of boards and create new board", () => {
    cy.findByText("My boards").should("be.visible");

    cy.findByText("Internals").should("be.visible");
    cy.findByText("Operating Systems").should("be.visible");
    cy.findByText("Fundamentals of Computation").should("be.visible");
    cy.findByText("Data Science").should("be.visible");

    cy.route("POST", "/api/boards/", "fixture:board_create.json");
    cy.findByText(/Create new board/i).click();
    cy.findByTestId("create-board-btn").should("be.disabled");
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
});

context("Board Detail (Owner)", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.route("GET", "/api/boards/1/", "fixture:internals_board.json");
    cy.visit("/b/1/");
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
      response: ""
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

  it("should move task down successfully", () => {
    cy.route("POST", "/api/sort/task/", "").as("sortTasks");

    cy.expectTasks("col-3", ["task-5", "task-4"]);

    cy.draggable("task-5")
      .focus()
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowDown, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.space, force: true })
      .then(() => {
        cy.wait("@sortTasks");
        cy.expectTasks("col-3", ["task-4", "task-5"]);
      });
  });

  it("should revert task movement on error", () => {
    cy.route({
      method: "POST",
      url: "/api/sort/task/",
      status: 500,
      response: ""
    }).as("sortTasks");

    const tasks = ["task-5", "task-4"];
    cy.expectTasks("col-3", tasks);

    cy.draggable("task-5")
      .focus()
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowDown, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.space, force: true })
      .then(() => {
        cy.wait("@sortTasks");
        cy.expectTasks("col-3", tasks);
      });
  });

  it("should move task to next column successfully", () => {
    cy.route("POST", "/api/sort/task/", "").as("sortTasks");

    cy.expectTasks("col-3", ["task-5", "task-4"]);
    cy.expectTasks("col-1", ["task-1", "task-2"]);

    cy.draggable("task-5")
      .focus()
      .trigger("keydown", { keyCode: keyCodes.space })
      .trigger("keydown", { keyCode: keyCodes.arrowRight, force: true })
      .trigger("keydown", { keyCode: keyCodes.arrowDown, force: true })
      .wait(200)
      .trigger("keydown", { keyCode: keyCodes.space, force: true })
      .then(() => {
        cy.wait("@sortTasks");
        cy.wait(200);
        cy.expectTasks("col-3", ["task-4"]);
        cy.expectTasks("col-1", ["task-1", "task-5", "task-2"]);
      });
  });

  it("should add new member", () => {
    cy.route("GET", "/api/users/?excludemembers=1", "fixture:users.json").as(
      "getUsers"
    );
    cy.route("POST", "api/boards/1/invite_member/", {
      id: 2,
      username: "steveapple1",
      email: "steve@gmail.com",
      first_name: "Steve",
      last_name: "Apple"
    }).as("inviteSteve");

    cy.findByTestId("member-invite").click();
    cy.get("#user-search")
      .focus()
      .type("ste");
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
    cy.route("POST", "api/boards/1/remove_member/", {
      id: 3,
      username: "daveice",
      email: "dave@ice.com"
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

  it.skip("should successfully edit task title", () => {
    const newTitle = "Admin page permissions";
    cy.route("PATCH", "api/tasks/1/", {
      title: newTitle
    }).as("updateTaskTitle");

    cy.findAllByTestId("edit–task-1").should("not.exist");
    cy.findByTestId("task-1")
      .trigger("mouseover")
      .within(() => {
        cy.findByTestId("edit-task-1").click();
      })
      .then(() => {
        cy.findByTestId("edit-text")
          .clear()
          .type("Admin page permissions{enter}");
      });

    cy.findByTestId("task-1")
      .trigger("mouseover")
      .within(() => {
        cy.findByTestId("edit-task-1").click();
      })
      .then(() => {
        cy.findByTestId("edit-text")
          .clear()
          .type("Setup linters");
      })
      .then(() => {
        cy.findByText(/Save/i).click();
      });
  });

  it("should delete task", () => {
    cy.route("DELETE", "api/tasks/1/", "").as("deleteTask");

    cy.findByTestId("task-1").click();
    cy.findByTestId("delete-task").click();
    cy.wait("@deleteTask");
    cy.findAllByTestId("task-1").should("not.exist");
  });

  it("should change task column through edit dialog", () => {
    cy.route("POST", "/api/sort/task/", "").as("sortTasks");

    cy.expectTasks("col-3", ["task-5", "task-4"]);
    cy.expectTasks("col-1", ["task-1", "task-2"]).then(() => {
      cy.findByTestId("task-1").click();
    });

    cy.findByTestId("edit-column")
      .within(() => {
        cy.get('button[aria-label="Open"]').click();
      })
      .then(() => {
        cy.get(".MuiAutocomplete-popper").within(() => {
          cy.findByText("In progress").click();
        });
      });

    cy.wait("@sortTasks").then(() => {
      cy.expectTasks("col-3", ["task-1", "task-5", "task-4"]);
      cy.expectTasks("col-1", ["task-2"]);
    });
  });
});
