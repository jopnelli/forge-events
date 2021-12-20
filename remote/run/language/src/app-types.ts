import {DocumentData, DocumentReference} from '@google-cloud/firestore';

export interface AppContext {
    authenticatedParentDoc: DocumentReference<DocumentData>
}

