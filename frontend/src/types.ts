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
  avatar: Avatar;
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
