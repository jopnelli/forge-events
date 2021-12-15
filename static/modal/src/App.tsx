import React, {useContext, useMemo, useState} from "react";
import styled from "styled-components";
import {PageSelect} from "shared/PageSelect";
import {LanguageSelect} from "shared/LanguageSelect";
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsync} from "react-use";
import {getLinks} from "shared/api";
import {LanguageLinkInFirestore, LinkRequestItem} from "shared-types/types";

function App() {
    const atlassianContext = useContext(AtlassianContext);
    const pageId: number = parseInt(atlassianContext.forgeContext.extension.content.id);
    const pageLinks = useAsync(async () => {
        const loadedLinks = await getLinks();
        setNewPageLinks(loadedLinks.map(({pageId, languageISO2}) => ({pageId, languageISO2})));
        return loadedLinks;
    });
    const currentPageLanguageLink = useMemo(() => {
        if (pageLinks.loading || !pageLinks.value) {
            return null;
        }
        return pageLinks.value.find(link => link.pageId === pageId) || null;
    }, [pageLinks, pageId]);

    type LinkRequestItemEditState = LinkRequestItem & { removed?: boolean };
    const [newPageLinks, setNewPageLinks] = useState<LinkRequestItemEditState[]>([]);

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

        </AppWrapper>
    );
}

const AppWrapper = styled.div`
  padding: 0 1rem;
`
export default App;
