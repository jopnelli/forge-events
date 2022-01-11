import React, {useCallback, useContext, useEffect} from 'react';
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsyncFn} from "react-use";
import {getLinks} from "shared/api";
import LoadingButton from '@atlaskit/button/loading-button';
import {VALID_LANGUAGES} from "./valid-languages";
import {Modal, router} from '@forge/bridge';
import styled from "styled-components";
import Button from "@atlaskit/button";
import EditorSettingsIcon from '@atlaskit/icon/glyph/editor/settings';
import ContentLoader, {IContentLoaderProps} from "react-content-loader";
import {Trans, useTranslation} from 'react-i18next';

export function LanguageOverview() {
    const atlassianContext = useContext(AtlassianContext);
    const currentPageId = parseInt(atlassianContext.forgeContext.extension.content.id);
    const [pageLinksState, fetch] = useAsyncFn(getLinks);
    const {t} = useTranslation();

    useEffect(() => {
        fetch()
    }, [fetch]);

    const openModal = useCallback(() => {
        const modal = new Modal({
            resource: "modal-res",
            context: {}, // will be passed to modal
            async onClose({canceled}) {
                !canceled && fetch();
            },
        });
        modal.open();
    }, [fetch]);

    useEffect(() => {
        if (!pageLinksState.loading && pageLinksState.value?.length === 0) {
            openModal();
        }
    }, [openModal, pageLinksState]);


    if (pageLinksState.loading) {
        return <OverviewLoader/>;
    }
    if (pageLinksState.error) {
        return <>
            <p>
                <strong><Trans>Could not fetch languages</Trans></strong>
            </p>
            <p>
                <Trans>If this error persists please contact your administrator.</Trans>
            </p>
            <p>
                ({pageLinksState.error.name}) {pageLinksState.error.message}
            </p>
        </>

    }

    if (pageLinksState.value?.length === 0) {
        return <EmptyState>
            <DescriptionText><Trans>Set a language for this page and connect further pages with similar content and different languages to easily switch between them.</Trans></DescriptionText>
            <Button onClick={openModal}><Trans>Add languages</Trans></Button>
        </EmptyState>
    }

    if (pageLinksState.value?.length === 1) {
        return <EmptyState>
            <DescriptionText><Trans>Connect further pages with similar content and different languages to easily switch between them.</Trans></DescriptionText>
            <Button onClick={openModal}><Trans>Add further languages</Trans></Button>
        </EmptyState>
    }
    return <>
        <Languages>
            {pageLinksState.value?.filter(pageLink => pageLink.pageId === currentPageId).map(pageLink =>
                <LanguageButton language={pageLink.languageISO2}
                                url={pageLink.url}
                                postFix={t('this page')}
                                isDisabled
                                key={pageLink.pageId}/>)}
            {pageLinksState.value?.filter(pageLink => pageLink.pageId !== currentPageId).map(pageLink =>
                <LanguageButton language={pageLink.languageISO2}
                                url={pageLink.url}
                                base={pageLink.base}
                                key={pageLink.pageId}/>)}
        </Languages>
        <Actions>
            <Button onClick={openModal} appearance="subtle"
                    iconBefore={<EditorSettingsIcon label="edit"/>}><Trans>Configure</Trans></Button>
        </Actions>
    </>;

}


const EmptyState = styled.div`
  
  & button {
    width: 100%;
  }
   
  & h1 {
    width: 100%;
    text-align: left;
    padding-bottom: 0.5rem;
  }

  & div.globe {
    min-height: 156px;
    background-image: url("./globe.png");
    background-size: contain;
    cursor: pointer;
    padding-top: 1rem;
    padding-bottom: 0.5rem;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
`
const Actions = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`
const DescriptionText = styled.div`
    padding-bottom: 1.5rem;
    text-align: center;
`

const Languages = styled.div`
  padding-bottom: 1.5rem;
`

interface LanguageButtonProps {
    language: string
    url?: string
    base?: string
    isDisabled?: boolean
    postFix?: string
}

function LanguageButton(
    {
        language, url, isDisabled, postFix
    }
        : LanguageButtonProps) {
    return <ButtonWrapper onClick={e => e.preventDefault()} href={url}>
            <LoadingButton shouldFitContainer onClick={() => url && router.navigate("/wiki" + url)}
                           isDisabled={isDisabled}>
                {VALID_LANGUAGES[language]}{postFix}
            </LoadingButton>
    </ButtonWrapper>
}

const ButtonWrapper = styled.a`
  padding-bottom: 0.5rem;
  text-decoration: none !important;
  display: block;
`

const OverviewLoader = (props: IContentLoaderProps) => (
    <ContentLoader
        speed={2}
        width={285}
        height={180}
        viewBox="0 0 285 180"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="0" rx="3" ry="3" width="288" height="32"/>
        <rect x="0" y="40" rx="3" ry="3" width="288" height="32"/>
        <rect x="0" y="80" rx="3" ry="3" width="288" height="32"/>
        <rect x="0" y="120" rx="3" ry="3" width="288" height="32"/>
        <rect x="180" y="160" rx="3" ry="3" width="109" height="32"/>
    </ContentLoader>
)
