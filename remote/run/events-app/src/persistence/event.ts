import { EventInFirestore, Event } from "../../../../../types/types";
import {
  CollectionReference,
  DocumentReference,
  Transaction,
} from "@google-cloud/firestore";

export function eventPersistence({
  authenticatedParentDoc,
}: {
  authenticatedParentDoc: DocumentReference;
}) {
  const eventCollection = authenticatedParentDoc.collection(
    "events"
  ) as CollectionReference<EventInFirestore>;
  // const db = authenticatedParentDoc.firestore;

  async function createEvent(event: EventInFirestore): Promise<Event> {
    const doc = await eventCollection.add(event);
    return { ...event, id: doc.id };
  }

  return {
    createEvent,
  };
}
