import { Id } from "../base/Id";

export type UserId = Id<"user">;
export type FileId = Id<"file">;

export type DocumentId = Id<"document">;
export type DocumentAttachmentId = Id<"documentAttachment">;
export type DocumentHistoryId = Id<"documentHistory">;
export type DocumentSnapshotId = Id<"documentSnapshot">;

export type EntityId = Id<"entity">;
export type GroupId = Id<"group">;
export type GroupMemberId = Id<"groupMember">;
export type GroupRoleId = Id<"groupRole">;

export type OperationId = Id<"operation">;
export type OperationCreateId = Id<"operationCreate">;
export type OperationDeleteId = Id<"operationDelete">;
export type OperationModifyId = Id<"operationModify">;
export type OperationShareId = Id<"operationShare">;

export type CommentId = Id<"comment">;
export type PostId = Id<"post">;
export type ShareId = Id<"share">;

export type RequestId = Id<"request">;
export type RequestItemId = Id<"requestItem">;

export type IdTypes =
  | UserId
  | FileId
  | DocumentId
  | DocumentAttachmentId
  | DocumentHistoryId
  | DocumentSnapshotId
  | EntityId
  | GroupId
  | GroupMemberId
  | GroupRoleId
  | OperationId
  | OperationCreateId
  | OperationDeleteId
  | OperationModifyId
  | OperationShareId
  | CommentId
  | PostId
  | ShareId
  | RequestId
  | RequestItemId;
