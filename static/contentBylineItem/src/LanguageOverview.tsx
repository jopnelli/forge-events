import React, {useContext, useEffect} from 'react';
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

export function LanguageOverview() {
    const atlassianContext = useContext(AtlassianContext);
    const currentPageId = parseInt(atlassianContext.forgeContext.extension.content.id);
    const [pageLinksState, fetch] = useAsyncFn(getLinks);

    useEffect(() => {
        fetch()
    }, [fetch]);

    if (pageLinksState.loading) {
        return <OverviewLoader/>;
    }

    if (pageLinksState.error) {
        return <>
            <p>
                <strong>Could not fetch languages</strong>
            </p>
            <p>
                If this error persists please contact your administrator.
            </p>
            <p>
                ({pageLinksState.error.name}) {pageLinksState.error.message}
            </p>
        </>
    }

    const openModal = () => {
        const modal = new Modal({
            resource: "modal-res",
            context: {}, // will be passed to modal
            async onClose({canceled}) {
                !canceled && fetch();
            },
        });
        modal.open();
    };


    if (pageLinksState.value?.length === 0) {
        return <EmptyState>
            <Headline>
                No language linked
            </Headline>
            <div onClick={openModal} className="globe"/>
            <span>Add languages by clicking the globe!</span>
        </EmptyState>
    }


    if (pageLinksState.value?.length === 1) {
        return <EmptyState>
            <Headline>
                This content is ⪢{VALID_LANGUAGES[pageLinksState.value![0].languageISO2]}«
            </Headline>
            <div onClick={openModal} className="globe"/>
            <span>Add further languages by clicking the globe!</span>
        </EmptyState>
    }
    return <>
        <Headline>
            {pageLinksState.value?.length} available languages for this content
        </Headline>
        <Languages>
            {pageLinksState.value?.filter(pageLink => pageLink.pageId === currentPageId).map(pageLink =>
                <LanguageButton language={pageLink.languageISO2}
                                url={pageLink.url}
                                postFix=" (this page)"
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
                    iconBefore={<EditorSettingsIcon label="edit"/>}>Configure</Button>
        </Actions>
    </>;

}


const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

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

  & span {
    margin-top: 1rem;
    text-align: center;
  }
`
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
    base?: string
    isDisabled?: boolean
    postFix?: string
}

function LanguageButton(
    {
        language, url, isDisabled, postFix, base
    }
        : LanguageButtonProps) {
    return <ButtonWrapper href={base && (base.replace("/wiki", "") + url)}>
            <LoadingButton shouldFitContainer onClick={() => url && router.navigate(url)}
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
        <rect x="1" y="32" rx="3" ry="3" width="288" height="32"/>
        <rect x="180" y="159" rx="0" ry="0" width="109" height="31"/>
        <rect x="1" y="72" rx="3" ry="3" width="288" height="32"/>
        <rect x="1" y="113" rx="3" ry="3" width="288" height="32"/>
        <rect x="1" y="1" rx="3" ry="3" width="273" height="12"/>
    </ContentLoader>
)
