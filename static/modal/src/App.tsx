import React, {useContext, useMemo, useState} from "react";
import styled from "styled-components";
import {PageSelect} from "shared/PageSelect";
import {LanguageSelect} from "shared/LanguageSelect";
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsync} from "react-use";
import {getLinks} from "shared/api";
import {LanguageLinkInFirestore} from "shared-types/types";

function App() {
    const atlassianContext = useContext(AtlassianContext);
    const pageId: string = atlassianContext.forgeContext.extension.content.id;
    const pageLinks = useAsync(async () => {
        const loadedLinks = await getLinks();
        setNewPageLinks(loadedLinks);
        return loadedLinks;
    });
    const currentPageLanguageLink = useMemo(() => {
        if (pageLinks.loading || !pageLinks.value) {
            return null;
        }
        return pageLinks.value.find(link => link.pageId.toString() === pageId) || null;
    }, [pageLinks]);
    const [newPageLinks, setNewPageLinks] = useState<LanguageLinkInFirestore[] | null>(null);

    const editPageLink = (languageLinkUpdate: Partial<LanguageLinkInFirestore> & { pageId: LanguageLinkInFirestore["pageId"] }) => {
        setNewPageLinks(prevState => {
            if (!prevState) {
                return null;
            }
            return prevState.map(link => {
                if (languageLinkUpdate.pageId !== link.pageId) {
                    return link;
                }
                return {...link, ...languageLinkUpdate};
            });
        })
    }

    if (pageLinks.loading || !newPageLinks) {
        return <div>Loading...</div>;
    }


    return (
        <AppWrapper>
            {JSON.stringify(newPageLinks)}
            <PageSelect disabled defaultValuePageId={pageId} />
            <LanguageSelect defaultValue={currentPageLanguageLink?.languageISO2}
                onChange={languageCode => editPageLink({languageISO2: languageCode, pageId: parseInt(pageId)})} />


        </AppWrapper>
    );
}

const AppWrapper = styled.div`
  padding: 0 1rem;
`
export default App;
