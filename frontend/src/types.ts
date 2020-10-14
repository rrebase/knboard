import { Theme } from "@material-ui/core";

export type Id = number;

export interface BoardMember {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: Avatar | null;
}

export interface Label {
  id: number;
  name: string;
  color: string;
  board: Id;
}

export interface NanoBoard {
  id: number;
  name: string;
  owner: Id;
}

export interface Board {
  id: number;
  name: string;
  owner: Id;
  members: BoardMember[];
}

export interface IColumn {
  id: number;
  title: string;
  board: Id;
}

export type PriorityValue = "H" | "M" | "L";

export interface Priority {
  value: PriorityValue;
  label: "High" | "Medium" | "Low";
}

export interface ITask {
  id: Id;
  created: string;
  modified: string;
  title: string;
  description: string;
  labels: Id[];
  assignees: Id[];
  priority: PriorityValue;
}

export interface NewTask extends Omit<ITask, "id" | "created" | "modified"> {
  column: Id;
}

export interface TasksByColumn {
  [key: string]: Id[];
}

export interface User {
  id: number;
  username: string;
  photo_url: string | null;
}

export interface UserDetail {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar: Avatar | null;
  date_joined: string;
  is_guest: boolean;
}

export interface TaskComment {
  id: number;
  task: number;
  author: number;
  text: string;
  created: string;
  modified: string;
}

export type NewTaskComment = Omit<
  TaskComment,
  "id" | "author" | "created" | "modified"
>;

export interface Avatar {
  id: number;
  photo: string;
  name: string;
}

export interface WithTheme {
  theme: Theme;
}

export interface AuthSetup {
  ALLOW_GUEST_ACCESS: boolean;
}

export type Status = "idle" | "loading" | "succeeded" | "failed";
