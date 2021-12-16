import React, {useContext} from 'react';
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsync} from "react-use";
import {getLinks} from "shared/api";
import LoadingButton from '@atlaskit/button/loading-button';
import {VALID_LANGUAGES} from "./valid-languages";
import {router} from '@forge/bridge';
import styled from "styled-components";

export function LanguageOverview() {
    const pageLinks = useAsync(getLinks);
    if (pageLinks.loading) {
        return <div>please wait...</div>;
    }

    if (pageLinks.error) {
        return <div>error retrieving page links</div>;
    }

    if (pageLinks.value?.length === 0) {
        return <div>no page links</div>;
    }

    return <div>{pageLinks.value?.map((pageLink) => <LanguageButton language={pageLink.languageISO2} pageId={pageLink.pageId} url={pageLink.url}
        key={pageLink.pageId} />)}</div>;

}

interface LanguageButtonProps {
    language: string
    pageId: number
    url?: string
}

function LanguageButton({language, pageId, url}: LanguageButtonProps) {
    const atlassianContext = useContext(AtlassianContext);
    const currentPageId = atlassianContext.forgeContext.extension.content.id;

    return <ButtonWrapper>
        <LoadingButton appearance="subtle-link" shouldFitContainer onClick={() => url && router.open(url)} isDisabled={pageId.toString() === currentPageId}>
            {VALID_LANGUAGES[language]}
            {pageId.toString() === currentPageId && " (this page)"}
        </LoadingButton>
    </ButtonWrapper>
}

const ButtonWrapper = styled.div`padding-bottom: 0.5rem;`
