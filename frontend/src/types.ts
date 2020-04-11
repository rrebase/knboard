export type Id = number;

export interface BoardOwner {
  id: number;
}

export interface BoardMember {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: Avatar | null;
}

export interface Board {
  id: number;
  name: string;
  owner: BoardOwner;
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
  title: string;
  description: string;
  assignees: Id[];
  priority: PriorityValue;
  column: Id;
}

export interface NewTask extends Omit<ITask, "id" | "priority" | "assignees"> {
  priority: Priority;
  column: Id;
  assignees: BoardMember[];
}

export interface TasksByColumn {
  [key: string]: Id[];
}

export interface User {
  key: string;
  id: number;
  username: string;
  photo_url: string | null;
}

export interface UserDetail {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: Avatar | null;
  date_joined: string;
}

export interface Avatar {
  id: number;
  photo: string;
  name: string;
}
