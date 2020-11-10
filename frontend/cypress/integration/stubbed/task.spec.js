/* eslint-disable @typescript-eslint/camelcase */
/// <reference types="cypress" />
import * as keyCodes from "../../util";

context("Task", () => {
  beforeEach(() => {
    cy.stubbedSetup();
    cy.route("GET", "/api/boards/1/", "fixture:internals_board.json");
    cy.route("GET", `/api/comments/**`, []);
    cy.visit("/b/1/");
    cy.title().should("eq", "Internals | Knboard");
  });

  const createTaskResponse = {
    id: 1000,
    created: "2020-05-17T08:26:51.806330Z",
    modified: "2020-05-17T09:02:10.724890Z",
    title: "",
    description: "",
    column: 1,
    assignees: [],
    labels: [],
    priority: "M",
  };

  it("should create task", () => {
    const title = "Improve CI";
    cy.route("POST", "api/tasks/", { ...createTaskResponse, title });

    cy.contains("Add card").first().click();
    cy.findByTestId("create-task-title").type(title);
    cy.findByTestId("task-create").click();
    cy.findByText(title).should("be.visible");
  });

  it("should create task with shortcut", () => {
    const title = "Redesign concept";
    cy.route("POST", "api/tasks/", { ...createTaskResponse, title });

    cy.contains("Add card").first().click();
    cy.findByTestId("create-task-title").type(title + "{meta}{enter}");
    cy.findByText(title).should("be.visible");
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
      response: "",
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

  it("should successfully edit task title via blur and enter", () => {
    cy.route("PATCH", "api/tasks/1/", "");

    cy.findByTestId("task-1").click();
    cy.findByTestId("task-title").click().clear().type("Fresh");
    cy.findByText("Description").click();
    cy.findByText("Fresh").should("exist");
    cy.findByText("Fresh").type(" one{enter}");
    cy.findByText("Fresh one").should("exist");
  });

  it("should successfully edit task priority", () => {
    cy.fixture("internals_board").then((board) => {
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
        cy.get("[data-testid='task-priority'] svg").should(
          "have.css",
          "color",
          "rgb(255, 170, 170)"
        );
      });
    });
  });

  it("should edit & save task description", () => {
    cy.route("PATCH", "api/tasks/1/", "");
    const initialTargetText = "Use figma designs provided by Steve.";
    const newText = "New text";

    cy.findByTestId("task-1").click();
    cy.findByText(initialTargetText).should("be.visible");
    cy.findByTestId("task-description").dblclick();
    cy.get("#textarea")
      .type(newText + "{meta}{enter}")
      .then(() => {
        cy.findAllByText(newText).should("be.visible");
      });
    cy.findByTestId("task-description").dblclick();
    cy.get("#textarea").type(initialTargetText);
    cy.findByText(/Save.*/)
      .click()
      .then(() => {
        cy.findAllByText(initialTargetText).should("be.visible");
      });
  });

  it("should cancel edit task description", () => {
    cy.route("PATCH", "api/tasks/1/", "");
    const initialTargetText = "Use figma designs provided by Steve.";
    const draftText = "Draft text";

    cy.findByTestId("task-1").click();
    cy.findByText(initialTargetText).should("be.visible");
    cy.findAllByText(draftText).should("not.exist");

    cy.findByTestId("task-description").dblclick();
    cy.get("#textarea").type(draftText);
    cy.findAllByText(draftText).should("exist");

    cy.findByTestId("cancel-description").click();
    cy.findByText(initialTargetText).should("be.visible");
    cy.findAllByText(draftText).should("not.exist");

    cy.findByTestId("task-description").dblclick();
    cy.get("#textarea").type(draftText);
    cy.findAllByText(draftText).should("exist");

    cy.get("#textarea").type("{esc}");
    cy.findByText(initialTargetText).should("be.visible");
    cy.findAllByText(draftText).should("not.exist");
  });

  it("should delete task", () => {
    const stub = cy.stub();
    stub.onFirstCall().returns(true);
    cy.on("window:confirm", stub);
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

  it("should add a label", () => {
    cy.fixture("internals_board").then((board) => {
      const label = board.labels[0];
      const task = board.columns[1].tasks[0];
      cy.route("PATCH", `/api/tasks/${task.id}/`, {
        ...task,
        labels: [label.id],
      }).as("patchTask");

      cy.findByTestId(`task-${task.id}`).click();
      cy.findByTestId("edit-labels")
        .within(() => {
          cy.get('button[aria-label="Open"]').click();
        })
        .then(() => {
          cy.get(".MuiAutocomplete-popper").within(() => {
            cy.findByText(label.name).click();
          });
        });
      cy.wait("@patchTask").then(() => {
        cy.findByTestId("close-dialog")
          .click()
          .then(() => {
            cy.findByText(label.name).should("be.visible");
          });
      });
    });
  });

  it("should assign a member to task", () => {
    cy.fixture("internals_board").then((board) => {
      const member = board.members[0];
      const task = board.columns[1].tasks[0];
      cy.route("PATCH", `/api/tasks/${task.id}/`, {
        ...task,
        assignees: [member.id],
      }).as("patchTask");

      cy.findByTestId(`task-${task.id}`).click();
      cy.findByTestId("open-edit-assignees").click();
      cy.get(".MuiAutocomplete-popper").within(() => {
        cy.findByText(member.username).click();
      });
      cy.findByTestId("close-popper").click();
      cy.wait("@patchTask").then(() => {
        cy.findByTestId("close-dialog")
          .click()
          .then(() => {
            cy.findByTestId("task-1").within(() => {
              cy.findByText(member.username[0]).should("be.visible");
            });
          });
      });
    });
  });

  it("should add a comment to task", () => {
    cy.fixture("internals_board").then((board) => {
      const task = board.columns[1].tasks[0];
      const existingComment = {
        id: 1,
        task: task.id,
        author: 1, // testuser from stubbedSetup
        text: "A comment that exists.",
        created: "2020-10-13T18:10:48.551816Z",
        modified: "2020-10-13T18:10:48.551816Z",
      };
      cy.route("GET", `/api/comments/?task=${task.id}`, [existingComment]).as(
        "getComments"
      );

      const newComment = {
        id: 2,
        task: task.id,
        author: 1, // testuser from stubbedSetup
        text: "A new comment.",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      };
      cy.route("POST", `/api/comments/`, newComment).as("postComment");

      cy.findByTestId(`task-${task.id}`).click();
      cy.findByRole("textbox", { name: /comment/i })
        .type(newComment.text)
        .then(() => {
          cy.findByRole("button", { name: /post comment/i }).click();
        });

      cy.wait("@postComment").then(() => {
        cy.findByText("A new comment.").should("be.visible");
        cy.findByText("less than a minute ago").should("be.visible");
        cy.findByText("A comment that exists.").should("be.visible");
      });
    });
  });

  it("should delete a comment from a task", () => {
    cy.fixture("internals_board").then((board) => {
      const stub = cy.stub();
      stub.onFirstCall().returns(true);
      cy.on("window:confirm", stub);

      const task = board.columns[1].tasks[0];
      const commentToBeDeleted = {
        id: 1,
        task: task.id,
        author: 1, // testuser from stubbedSetup
        text: "A comment that will be deleted.",
        created: "2020-10-13T18:10:48.551816Z",
        modified: "2020-10-13T18:10:48.551816Z",
      };
      const commentThatRemains = {
        id: 2,
        task: task.id,
        author: 3, // daveice
        text: "A comment that will remain.",
        created: "2020-10-20T16:22:55.115181Z",
        modified: "2020-10-20T16:22:55.115181Z",
      };
      cy.route("GET", `/api/comments/?task=${task.id}`, [
        commentToBeDeleted,
        commentThatRemains,
      ]).as("getComments");

      cy.route("DELETE", `/api/comments/${task.id}`, "").as("deleteComment");

      cy.findByTestId(`task-${task.id}`).click();
      cy.findByTestId(`delete-comment-${commentThatRemains.id}`).should(
        "not.be.visible",
        "Delete link must not be visible to others than the comment's author"
      );
      cy.findByTestId(`delete-comment-${commentToBeDeleted.id}`).click();

      cy.wait("@deleteComment").then(() => {
        cy.findByText(commentToBeDeleted.text).should("not.be.visible");
        cy.findByText(commentThatRemains.text).should("be.visible");
      });
    });
  });
});
