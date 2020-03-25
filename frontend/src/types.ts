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
}

export interface AuthorColors {
  soft: string;
  hard: string;
}

export interface Author {
  id: Id;
  name: string;
  avatarUrl: string;
  colors: AuthorColors;
}

export interface ITask {
  id: Id;
  title: string;
  description: string;
  author?: Author;
}

export interface TasksByColumn {
  [key: string]: Id[];
}

export interface User {
  key: string;
  username: string;
}
