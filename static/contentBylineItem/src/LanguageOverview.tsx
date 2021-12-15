import React, {useContext, useEffect} from 'react';
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsync, useAsyncFn} from "react-use";
import {createLinks, getLinks} from "shared/api";
import {LanguageLinkInFirestore} from "../../../types/types";
import LoadingButton from '@atlaskit/button/loading-button';
import {VALID_LANGUAGES} from "./valid-languages";
import {requestConfluence, router} from '@forge/bridge';
import styled from "styled-components";

export function LanguageOverview() {
    const atlassianContext = useContext(AtlassianContext);
    const pageId = atlassianContext.forgeContext.extension.content.id;
    const pageLinks = useAsync(async () => await getLinks());
    // useEffect(() => {
    //     createLinks([{pageId: 40960001, languageISO2: "en"}, {pageId: 262362, languageISO2: "de"}])
    // }, []);
    if (pageLinks.loading) {
        return <div>please wait...</div>;
    }

    if (pageLinks.error) {
        return <div>error retrieving page links</div>;
    }

    if (pageLinks.value?.length === 0) {
        return <div>no page links</div>;
    }

    return <div>{pageLinks.value?.map((pageLink: LanguageLinkInFirestore) => <LanguageButton language={pageLink.languageISO2} pageId={pageLink.pageId}
        key={pageLink.pageId} />)}</div>;

}

interface LanguageButtonProps {
    language: string
    pageId: number
}

function LanguageButton({language, pageId}: LanguageButtonProps) {
    const atlassianContext = useContext(AtlassianContext);
    const currentPageId = atlassianContext.forgeContext.extension.content.id;

    const [pageLink, fetch] = useAsyncFn(async () => {
        const response = await requestConfluence(`/rest/api/content/${pageId}`);
        // TODO: Error handling
        const pageResponse = await response.json();
        await router.open(`${pageResponse._links.context}${pageResponse._links.webui}`);
    });

    return <ButtonWrapper>
        <LoadingButton shouldFitContainer isLoading={pageLink.loading} onClick={fetch} isDisabled={pageId.toString() === currentPageId}>
            {VALID_LANGUAGES[language]}
            {pageId.toString() === currentPageId && " (this page)"}
        </LoadingButton>
    </ButtonWrapper>
}

const ButtonWrapper = styled.div`padding-bottom: 0.5rem;`

interface AtlassianContentAPIResponse {
    id: string;
    type: string;
    status: string;
    title: string;
    space: Space;
    history: History;
    version: Version;
    macroRenderedOutput: MacroRenderedOutput;
    extensions: Extensions;
    _expandable: AtlassianContentAPIResponseExpandable;
    _links: AtlassianContentAPIResponseLinks;
}

interface AtlassianContentAPIResponseExpandable {
    childTypes: string;
    container: string;
    metadata: string;
    operations: string;
    schedulePublishDate: string;
    children: string;
    restrictions: string;
    ancestors: string;
    body: string;
    descendants: string;
}

interface AtlassianContentAPIResponseLinks {
    editui: string;
    webui: string;
    context: string;
    self: string;
    tinyui: string;
    collection: string;
    base: string;
}

interface Extensions {
    position: number;
}

interface History {
    latest: boolean;
    createdBy: CreatedBy;
    createdDate: Date;
    _expandable: HistoryExpandable;
    _links: HistoryLinks;
}

interface HistoryExpandable {
    lastUpdated: string;
    previousVersion: string;
    contributors: string;
    nextVersion: string;
}

interface HistoryLinks {
    self: string;
}

interface CreatedBy {
    type: string;
    accountId: string;
    accountType: string;
    email: string;
    publicName: string;
    timeZone: string;
    profilePicture: ProfilePicture;
    displayName: string;
    isExternalCollaborator: boolean;
    _expandable: CreatedByExpandable;
    _links: HistoryLinks;
}

interface CreatedByExpandable {
    operations: string;
    personalSpace: string;
}

interface ProfilePicture {
    path: string;
    width: number;
    height: number;
    isDefault: boolean;
}

interface MacroRenderedOutput {
}

interface Space {
    id: number;
    key: string;
    name: string;
    type: string;
    status: string;
    _expandable: SpaceExpandable;
    _links: SpaceLinks;
}

interface SpaceExpandable {
    settings: string;
    metadata: string;
    operations: string;
    lookAndFeel: string;
    identifiers: string;
    permissions: string;
    icon: string;
    description: string;
    theme: string;
    history: string;
    homepage: string;
}

interface SpaceLinks {
    webui: string;
    self: string;
}

interface Version {
    by: CreatedBy;
    when: Date;
    friendlyWhen: string;
    message: string;
    number: number;
    minorEdit: boolean;
    syncRev: string;
    syncRevSource: string;
    confRev: string;
    contentTypeModified: boolean;
    _expandable: VersionExpandable;
    _links: HistoryLinks;
}

interface VersionExpandable {
    collaborators: string;
    content: string;
}
