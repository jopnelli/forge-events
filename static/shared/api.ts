import { invoke } from "@forge/bridge";
import {
  EventInFirestore,
  LanguageLinkInFirestore,
  LinkRequestItem,
} from "../../types/types";

export function createEvent(event: EventInFirestore) {
  return invoke<Event>("createEvent", event);
}

// export function createLinks(linkRequestItems: LinkRequestItem[]) {
//   return invoke<number[]>("putLinks", linkRequestItems);
// }

// export function getLinks(pageId?: number) {
//   return invoke<(LanguageLinkInFirestore & { url?: string; base?: string })[]>(
//     "getLinks",
//     { pageId }
//   );
