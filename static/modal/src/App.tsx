import React, {useContext, useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import {PageSelect} from "shared/PageSelect";
import {LanguageSelect} from "shared/LanguageSelect";
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsyncFn} from "react-use";
import {createLinks, getLinks} from "shared/api";
import Button, {LoadingButton} from "@atlaskit/button";
import {LinkRequestItem} from "shared-types/types";
import TrashIcon from '@atlaskit/icon/glyph/trash';
import UndoIcon from '@atlaskit/icon/glyph/undo';

const MAX_LINKS = 10;

function App() {
    const atlassianContext = useContext(AtlassianContext);
    const pageId: number = parseInt(atlassianContext.forgeContext.extension.content.id);
    const [pageLinks, fetch] = useAsyncFn(async () => {
        const loadedLinks = await getLinks();
        const newPageLinks: LinkRequestItemEditState[] = !loadedLinks.length ? [{
            pageId,
            languageISO2: null,
        }] : loadedLinks.map(({pageId, languageISO2}) => ({pageId, languageISO2}));
        setNewPageLinks(newPageLinks);
        return newPageLinks;
    })
    const currentPageLanguageLink = useMemo(() => pageLinks.value?.find(link => link.pageId === pageId) || null, [pageLinks, pageId]);
    useEffect(() => {
        fetch();
    }, [fetch]);

    type LinkRequestItemEditState = { pageId: number | null, languageISO2: string | null, removed?: boolean };
    const [newPageLinks, setNewPageLinks] = useState<LinkRequestItemEditState[]>([]);
    const [saveState, save] = useAsyncFn(async () => {
        const linkRequest = newPageLinks
            .filter(link => !link.removed)
            .map(link => ({
                languageISO2: link.languageISO2,
                pageId: link.pageId
            })) as LinkRequestItem[];
        await createLinks(linkRequest);
        await fetch();
    }, [newPageLinks])

    const updatePageLink = (pageId: number | null, languageLinkUpdate: Partial<LinkRequestItemEditState>) =>
        setNewPageLinks(prevState =>
            prevState.map(link => pageId !== link.pageId ? link : {...link, ...languageLinkUpdate})
        )

    const addEditPageLink = () => setNewPageLinks(prevState => [...prevState, {pageId: null, languageISO2: null}]);

    const isAddingLinkAllowed = useMemo(() => {
        const lastLink = [...newPageLinks].pop();
        return lastLink && lastLink.languageISO2 && lastLink.pageId && newPageLinks.length < MAX_LINKS
    }, [newPageLinks]);

    const selectedPageIds = useMemo(() => newPageLinks
        .map(link => link.pageId)
        .filter(pageId => pageId)
        .map(pageId => pageId!.toString()), [newPageLinks]);
    const selectedLanguageCodes = useMemo(() => newPageLinks.map(link => link.languageISO2).filter(language => language) as string[], [newPageLinks]);

    if (pageLinks.loading) {
        return <div>Loading...</div>;
    }


    return (
        <AppWrapper>
            {JSON.stringify(newPageLinks)}
            <PageSelect disabled defaultValuePageId={pageId.toString()}/>
            <LanguageSelect defaultValue={currentPageLanguageLink?.languageISO2}
                            onChange={languageCode => updatePageLink(pageId, {languageISO2: languageCode, pageId})}/>
            <Button onClick={addEditPageLink} isDisabled={!isAddingLinkAllowed}>Add link</Button>
            <LoadingButton appearance={"primary"} onClick={save} isLoading={saveState.loading}>Save</LoadingButton>
            {
                newPageLinks.filter(link => link.pageId !== pageId).map(link => <div key={link.pageId}>
                    <PageSelect
                        defaultValuePageId={link.pageId?.toString()}
                        disabledPageIds={selectedPageIds}
                        onChange={pageId => updatePageLink(link.pageId, {pageId: parseInt(pageId)})}
                    />
                    <LanguageSelect defaultValue={link.languageISO2}
                                    disabledLanguageCodes={selectedLanguageCodes}
                                    onChange={languageCode => updatePageLink(link.pageId, {languageISO2: languageCode})}/>
                    <Button onClick={() => updatePageLink(link.pageId, {removed: !link.removed})}>
                        {link.removed ? <UndoIcon label="undo" size="small"/> : <TrashIcon label="trash" size="small"/>}
                    </Button>
                </div>)
            }
        </AppWrapper>
    );
}

const AppWrapper = styled.div`
  padding: 0 1rem;
`
export default App;
