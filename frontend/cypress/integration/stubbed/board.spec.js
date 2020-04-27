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

  it("should edit column title if not empty & cancel via esc", () => {
    cy.fixture("internals_board").then(board => {
      const colTitle = "In progress";
      const newColTitle = "Ongoing";
      const newColumn = board.columns.find(c => c.id === 3);
      cy.route("PATCH", "/api/columns/3/", {
        ...newColumn,
        title: newColTitle
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
      board: 1
    };
    cy.route("POST", "/api/columns/", newColumn);
    cy.findByTestId("add-col").click();
    cy.get('[data-rbd-droppable-id="board"]').scrollTo("right");
    cy.findByText(newColumn.title).should("be.visible");
  });

  it("should delete column", () => {
    cy.fixture("internals_board").then(board => {
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

  it("should successfully edit task title via blur and enter", () => {
    cy.route("PATCH", "api/tasks/1/", "");

    cy.findByTestId("task-1").click();
    cy.findByTestId("task-title")
      .click()
      .clear()
      .type("Fresh");
    cy.findByText("Description").click();
    cy.findByText("Fresh").should("be.visible");
    cy.findByText("Fresh").type(" one{enter}");
    cy.findByText("Fresh one").should("be.visible");
  });

  it("should successfully edit task description", () => {
    cy.route("PATCH", "api/tasks/1/", "");

    cy.findByTestId("task-1").click();
    cy.findByTestId("task-description").click();
    cy.get("#textarea").type(
      "Implement the landing page.\n\n### Definition of Done\n" +
        "- matches provided design\n- 💨 (smoke) tests"
    );
    cy.findByTestId("save-description").click();
    cy.findAllByTestId("save-description").should("not.exist");
    cy.findByText("Definition of Done").should("be.visible");
  });

  it("should successfully edit task priority", () => {
    cy.fixture("internals_board").then(board => {
      const task = board.columns[1].tasks[0];
      const updatedTask = { ...task, priority: "H" };
      cy.route("PATCH", `api/tasks/${task.id}/`, updatedTask);

      cy.findByTestId(`task-${task.id}`).click();
      cy.findByTestId("edit-priority")
        .within(() => {
          cy.get('button[aria-label="Open"]').click();
        })
        .then(() => {
          cy.get(".MuiAutocomplete-popper").within(() => {
            cy.findByText("High").click();
          });
        });
      cy.findByTestId("close-dialog").click();
      cy.findByTestId(`task-${task.id}`).within(() => {
        cy.findByTestId("task-priority").should("have.text", "H");
      });
    });
  });

  it("should cancel edit task description", () => {
    cy.route("PATCH", "api/tasks/1/", "");
    const initialTargetText = "Use figma designs provided by Steve.";
    const draftText = "Draft text";

    cy.findByTestId("task-1").click();
    cy.findByText(initialTargetText).should("be.visible");
    cy.findAllByText(draftText).should("not.exist");
    cy.findByTestId("task-description").click();

    cy.get("#textarea").type(draftText);
    cy.findAllByText(draftText).should("exist");

    cy.findByTestId("cancel-description").click();
    cy.findByText(initialTargetText).should("be.visible");
    cy.findAllByText(draftText).should("not.exist");
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
