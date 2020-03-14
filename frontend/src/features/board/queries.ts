import gql from "graphql-tag";

export const TASKS_QUERY = gql`
  query {
    allTasks {
      id
      title
    }
  }
`;
