/* eslint-disable @typescript-eslint/camelcase */
import "@testing-library/cypress/add-commands";

Cypress.Commands.add("e2eLogin", () => {
  cy.request({
    method: "POST",
    url: "http://localhost:3000/auth/login/",
    body: {
      username: "t@t.com",
      password: "test",
    },
  }).then((response) => {
    localStorage.setItem(
      "knboard-data",
      JSON.stringify({
        auth: {
          user: response.body,
        },
      })
    );
  });
});

Cypress.Commands.add("stubbedSetup", () => {
  cy.server({ force404: true });
  localStorage.setItem(
    "knboard-data",
    JSON.stringify({
      auth: {
        user: {
          id: 1,
          username: "testuser",
          photo_url: null,
        },
      },
    })
  );
});

const dragHandleDraggableId = "data-rbd-drag-handle-draggable-id";
const draggableId = "data-rbd-draggable-id";
const droppableId = "data-rbd-droppable-id";
const testId = "data-testid";

Cypress.Commands.add("draggable", (id) => {
  return cy.get(`[${dragHandleDraggableId}='${id}']`);
});

Cypress.Commands.add("droppable", (id) => {
  return cy.get(`[${droppableId}='${id}']`);
});

Cypress.Commands.add("expectColumns", (columns) => {
  cy.droppable("board")
    .children()
    .each(($el, index) => {
      expect($el[0].attributes[draggableId].value).to.eq(columns[index]);
    });
});

Cypress.Commands.add("expectTasks", (column, tasks) => {
  cy.droppable(column.replace("col-", "")).within(() => {
    cy.findByTestId("drop-zone")
      .children()
      .each(($el, index) => {
        expect($el[0].attributes[draggableId].value).to.eq(tasks[index]);
      });
  });
});

Cypress.Commands.add("expectMembers", (members) => {
  cy.findByTestId("member-group")
    .children()
    .each(($el, index) => {
      expect($el[0].attributes[testId].value).to.eq(`member-${members[index]}`);
    });
});

Cypress.Commands.add("closeDialog", () => {
  cy.get(".MuiDialog-container").click("left");
});
