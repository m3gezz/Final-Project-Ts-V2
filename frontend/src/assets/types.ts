import type { Control, FieldValues, Path } from "react-hook-form";

//Tip: mat9is walo hna a ahmed

//App
export type PaginationState = {
  current_page: number;
  last_page: number;
  to: number;
  total: number;
};

export type SearcherType = {
  pagination: PaginationState;
  search: string;
  category_id?: string;
  skill_id?: string;
  sort?: string;
  type?: string;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
};

//Fields
export type FieldType = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  link?: { label: string; path: string };
};

export type ControllerType<T extends FieldValues> = {
  control: Control<T>;
  f: Omit<FieldType, "name"> & { name: Path<T> };
};

//Default
export type DefaultFields = {
  id: number | string | undefined;
  created_at: string;
  updated_at: string;
};

export type DataType = DefaultFields & {
  label: string;
  description?: string;
};

//User
export type UserType = DefaultFields & {
  full_name: string;
  username: string;
  professional_title: string;
  avatar: string;
  bio: string;
  about: string;
  private: boolean;
  email: string;
  admin: boolean;
  email_verified_at: string;
};

export type PopulatedUser = UserType & {
  projects: ProjectType[];
  memberships: MembershipType[];
  skills: DataType[];
  badges: DataType[];
};

//Project
export type ProjectType = DefaultFields & {
  title: string;
  description: string;
  manifesto: string;
  image: string;
  private: boolean;
  user_id: UserType["id"];
  user: UserType;
  category_id: DataType["id"];
  category: DataType;
  likes_count: number;
  comments_count: number;
  isLiked: boolean;
  isRequested: boolean;
};

//Workspace
export type WorkspaceType = DefaultFields & {
  project_id: ProjectType["id"];
  progress: number;
};

export type PopulatedWorkspace = WorkspaceType & {
  project: ProjectType;
  memberships: (MembershipType & { user: UserType })[];
  requests: (RequestType & { user: UserType })[];
  invitations: (RequestType & { user: UserType })[];
  tasks: TaskType[];
  messages: PopulatedMessage[];
};

//Membership
export type MembershipType = DefaultFields & {
  role: string;
  workspace_id: WorkspaceType["id"];
  user_id: UserType["id"];
  user: UserType;
};

//request
export type RequestType = DefaultFields & {
  status: "pending" | "accepted" | "declined";
  workspace_id: WorkspaceType["id"];
  workspace: PopulatedWorkspace;
  user_id: UserType["id"];
  user: UserType;
};

//Message
export type MessageType = DefaultFields & {
  message: string;
  isDeleted: boolean;
  isEdited: boolean;
  isPinned: boolean;
  workspace_id: WorkspaceType["id"];
  user_id: UserType["id"];
};

export type PopulatedMessage = MessageType & {
  user: UserType;
  workspace?: WorkspaceType;
};

//Task
export type TaskType = DefaultFields & {
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  workspace_id: WorkspaceType["id"];
  user_id: UserType["id"];
};

export type PopulatedTask = TaskType & {
  user: UserType;
  workspace?: WorkspaceType;
};

export type CommentType = DefaultFields & {
  user: UserType;
  content: string;
};
