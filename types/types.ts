export interface LinkRequestItem {
  pageId: number;
  languageISO2: string;
}

export interface LanguageLinkInFirestore {
  linkId: number;
  pageId: number;
  languageISO2: string;
}

export interface EventInFirestore {
  name: string;
  description: string;
  // date: Date;
}

export interface Event extends EventInFirestore {
  id: string;
}

// Beschreibung des Dokumentobjekts
