import {LanguageLinkInFirestore, LinkRequestItem} from "../../../../../types/types";
import {CollectionReference, DocumentReference, Firestore, Transaction} from "@google-cloud/firestore";


export function languageLinkPersistence({authenticatedParentDoc}: { authenticatedParentDoc: DocumentReference }) {

    const linkCollection = authenticatedParentDoc.collection("links") as CollectionReference<LanguageLinkInFirestore>;
    const db = authenticatedParentDoc.firestore;

    async function updateLinks(linkRequestItems: LinkRequestItem[]): Promise<number[]> {
        console.log({linkRequestItems});
        return await db.runTransaction(async transaction => {
            const relatedLanguageLinks: LanguageLinkInFirestore[] = await getRelatedLanguageLinks({
                transaction,
                linkRequestItems
            });
            const relatedPageIdsToLanguageRecord: Record<number, string> = relatedLanguageLinks.reduce((l1, l2) => ({...l1, ...{[l2.pageId]: l2.languageISO2}}), {});
            const requestedPageIdsToLanguageRecord: Record<number, string> = linkRequestItems.reduce((l1, l2) => ({...l1, ...{[l2.pageId]: l2.languageISO2}}), {});
            console.log({
                relatedPageIdsToLanguageRecord,
                requestedPageIdsToLanguageRecord
            })
            if (isEqual(relatedPageIdsToLanguageRecord, requestedPageIdsToLanguageRecord) && isLinkedWithEachOther(relatedLanguageLinks)) {
                return [];
            }
            const linkId = determineLinkId(linkRequestItems);
            const newLanguageLinks: LanguageLinkInFirestore[] = linkRequestItems.filter(i => !relatedPageIdsToLanguageRecord[i.pageId]).map(i => ({linkId, ...i}));
            const updatedLanguageLinks: LanguageLinkInFirestore[] = relatedLanguageLinks.filter(l => requestedPageIdsToLanguageRecord[l.pageId]).map(l => {
                const pageId = l.pageId;
                return {
                    pageId,
                    linkId,
                    languageISO2: requestedPageIdsToLanguageRecord[pageId]
                }
            });
            const unlinkedLanguageLinks = relatedLanguageLinks.filter(l => !requestedPageIdsToLanguageRecord[l.pageId]).map(l => ({
                ...l,
                linkId: 0
            }));
            const writes = [...newLanguageLinks, ...updatedLanguageLinks, ...unlinkedLanguageLinks].map(link => {
                transaction.set(linkCollection.doc(link.pageId.toString()), link)
            });
            console.log({
                newLanguageLinks, updatedLanguageLinks, unlinkedLanguageLinks
            })
            await Promise.all(writes);
            return [...newLanguageLinks, ...updatedLanguageLinks].map(l => l.pageId);
        });
    }

    async function getLinksByPageId({pageId}: {pageId: number}): Promise<LanguageLinkInFirestore[]> {
        const querySnapshot = await linkCollection.where("pageId", "==", pageId).get();
        return querySnapshot.docs.map(d => d.data());
    }

    async function getRelatedLanguageLinks({
                                               transaction,
                                               linkRequestItems
                                           }: { transaction: FirebaseFirestore.Transaction, linkRequestItems: LinkRequestItem[] }): Promise<LanguageLinkInFirestore[]> {
        if (!linkRequestItems.length) {
            return [];
        }
        const pageIds = linkRequestItems.map(i => i.pageId);
        const relatedLanguageLinksByPageId = (await transaction.get(linkCollection.where("pageId", "in", pageIds))).docs.map(doc => doc.data());
        const uniqueRelatingLinkIds = Array.from(new Set(relatedLanguageLinksByPageId.map(link => link.linkId)));
        const relatedLanguageLinksByLinkId = !uniqueRelatingLinkIds.length ? [] : (await transaction.get(linkCollection.where("linkId", "in", uniqueRelatingLinkIds))).docs.map(doc => doc.data());
        const mergedQuery = [...relatedLanguageLinksByPageId, ...relatedLanguageLinksByLinkId];
        const uniqueQueryResults = mergedQuery.filter((doc, index, arr) => arr.findIndex(d => d.pageId === doc.pageId) === index)
        console.log({mergedQuery, uniqueQueryResults});
        return uniqueQueryResults;
    }

    function isLinkedWithEachOther(languageLinks: LanguageLinkInFirestore[]) {
        if (!languageLinks.length) {
            return false;
        }
        if (languageLinks.length === 1) {
            return languageLinks[0].linkId === 0;
        }
        const linkIds = new Set(languageLinks.map(l => l.linkId));
        return linkIds.size === 1 && !linkIds.has(0);
    }

    function determineLinkId(linkRequestItems: LinkRequestItem[]): number {
        if (linkRequestItems.length <= 1) {
            return 0;
        }
        return Math.min(...linkRequestItems.map(l => l.pageId))
    }

    function isEqual(record1: Record<number, string>, record2: Record<number, string>): boolean {
        const keysOfRecord1: string[] = Object.keys(record1);
        const keysOfRecord2: string[] = Object.keys(record2);
        if (keysOfRecord1.length !== keysOfRecord2.length) {
            return false;
        }
        return keysOfRecord1.every(key => record1[Number(key)] === record2[Number(key)]);
    }

    return {
        updateLinks,
        getLinksByPageId
    }
}
