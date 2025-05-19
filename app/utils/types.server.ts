import type { WithId, Document } from "mongodb";

export type Room = WithId<Document> & {
  name: string;
};
