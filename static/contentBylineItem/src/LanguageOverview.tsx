import React, {useContext} from 'react';
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsync} from "react-use";
import {getLinks} from "shared/api";
import LoadingButton from '@atlaskit/button/loading-button';
import {VALID_LANGUAGES} from "./valid-languages";
import {Modal, router} from '@forge/bridge';
import styled from "styled-components";
import Button from "@atlaskit/button";
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';

export function LanguageOverview() {
    const atlassianContext = useContext(AtlassianContext);
    const currentPageId = parseInt(atlassianContext.forgeContext.extension.content.id);
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

    const openModal = () => {
        const modal = new Modal({
            resource: "modal-res",
            context: {}, // will be passed to modal
            async onClose() {
            },
        });
        modal.open();
    };

    return <>
        <Headline>
            {pageLinks.value?.length} available languages for this page
        </Headline>
        <Languages>
        {pageLinks.value?.filter(pageLink => pageLink.pageId === currentPageId).map(pageLink =>
            <LanguageButton language={pageLink.languageISO2}
                            url={pageLink.url}
                            postFix=" (this page)"
                            isDisabled
                            key={pageLink.pageId}/>)}
        {pageLinks.value?.filter(pageLink => pageLink.pageId !== currentPageId).map(pageLink =>
            <LanguageButton language={pageLink.languageISO2}
                            url={pageLink.url}
                            key={pageLink.pageId}/>)}
        </Languages>
        <Actions>
            <Button onClick={openModal} appearance="subtle" iconBefore={<EditorSettingsIcon label="edit"/>}>Configure</Button>
        </Actions>
    </>;

}


const Actions = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`

const Languages = styled.div`
  padding-bottom: 1.5rem;
`

const Headline = styled.h1`
  font-size: 12px;
  text-transform: uppercase;
  padding-bottom: 1rem;
`

interface LanguageButtonProps {
    language: string
    url?: string
    isDisabled?: boolean
    postFix?: string
}

function LanguageButton({language, url, isDisabled, postFix}: LanguageButtonProps) {
    return <ButtonWrapper>
        <LoadingButton shouldFitContainer onClick={() => url && router.open(url)}
                       isDisabled={isDisabled}>
            {VALID_LANGUAGES[language]}{postFix}
        </LoadingButton>
    </ButtonWrapper>
}

const ButtonWrapper = styled.div`padding-bottom: 0.5rem;`
