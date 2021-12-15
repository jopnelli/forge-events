import React, {useContext, useMemo, useState} from "react";
import styled from "styled-components";
import {PageSelect} from "shared/PageSelect";
import {LanguageSelect} from "shared/LanguageSelect";
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsync, useAsyncFn} from "react-use";
import {createLinks, getLinks} from "shared/api";
import {LoadingButton} from "@atlaskit/button";
import {LinkRequestItem} from "shared-types/types";

function App() {
    const atlassianContext = useContext(AtlassianContext);
    const pageId: number = parseInt(atlassianContext.forgeContext.extension.content.id);
    const pageLinks = useAsync(async () => {
        const loadedLinks = await getLinks();
        const newPageLinks: LinkRequestItemEditState[] = !loadedLinks.length ? [{
            pageId,
            languageISO2: null,
        }] : loadedLinks.map(({pageId, languageISO2}) => ({pageId, languageISO2}));
        setNewPageLinks(newPageLinks);
        return newPageLinks;
    });
    const currentPageLanguageLink = useMemo(() => pageLinks.value?.find(link => link.pageId === pageId) || null, [pageLinks, pageId]);

    type LinkRequestItemEditState = { pageId: number, languageISO2: string | null, removed?: boolean };
    const [newPageLinks, setNewPageLinks] = useState<LinkRequestItemEditState[]>([]);
    const [saveState, save] = useAsyncFn(async () => {
        const linkRequest = newPageLinks.map(link => ({
            languageISO2: link.languageISO2,
            pageId: link.pageId
        })) as LinkRequestItem[];
        await createLinks(linkRequest);
    }, [newPageLinks])

    const editPageLink = (languageLinkUpdate: Partial<LinkRequestItemEditState> & { pageId: number }) =>
        setNewPageLinks(prevState =>
            prevState.map(link => languageLinkUpdate.pageId !== link.pageId ? link : {...link, ...languageLinkUpdate})
        )

    if (pageLinks.loading) {
        return <div>Loading...</div>;
    }

    return (
        <AppWrapper>
            {JSON.stringify(newPageLinks)}
            <PageSelect disabled defaultValuePageId={pageId.toString()}/>
            <LanguageSelect defaultValue={currentPageLanguageLink?.languageISO2}
                            onChange={languageCode => editPageLink({languageISO2: languageCode, pageId})}/>
            <LoadingButton appearance={"primary"} onClick={save} isLoading={saveState.loading}>Save</LoadingButton>
        </AppWrapper>
    );
}

const AppWrapper = styled.div`
  padding: 0 1rem;
`
export default App;
