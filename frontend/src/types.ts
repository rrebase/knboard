export type Id = string;
export type TypeId = Id;
export type DraggableId = Id;
export type DroppableId = Id;

// There are two seperate modes that a drag can be in
// FLUID: everything is done in response to highly granular input (eg mouse)
// SNAP: items move in response to commands (eg keyboard);
export type MovementMode = "FLUID" | "SNAP";

export type DraggableLocation = {
  droppableId: DroppableId;
  index: number;
};

export type AuthorColors = {
  soft: string;
  hard: string;
};

export type Author = {
  id: Id;
  name: string;
  avatarUrl: string;
  url: string;
  colors: AuthorColors;
};

export type Quote = {
  id: Id;
  content: string;
  author: Author;
};

export type Dragging = {
  id: DraggableId;
  location: DraggableLocation;
};

export type QuoteMap = {
  [key: string]: Quote[];
};

export type Task = {
  id: Id;
  content: string;
};

export type DraggableRubric = {
  draggableId: DraggableId;
  type: TypeId;
  source: DraggableLocation;
};

export type Combine = {
  draggableId: DraggableId;
  droppableId: DroppableId;
};

// published when a drag starts
export interface DragStart extends DraggableRubric {
  mode: MovementMode;
}

export interface DragUpdate extends DragStart {
  // may not have any destination (drag to nowhere)
  destination?: DraggableLocation;
  // populated when a draggable is dragging over another in combine mode
  combine?: Combine;
}

export type DropReason = "DROP" | "CANCEL";

export interface DropResult extends DragUpdate {
  reason: DropReason;
}
