import React, {ReactElement} from "react";
import {requestConfluence} from "@forge/bridge";
import {AsyncSelect, ValueType} from "@atlaskit/select";
import styled from "styled-components";
import {useAsync} from "react-use";
import {SkeletonItem} from "@atlaskit/menu";
import LockIcon from "@atlaskit/icon/glyph/lock";
import QuestionIcon from "@atlaskit/icon/glyph/question";

interface Props {
    disabledPageIds?: string[],
    defaultValuePageId?: string,
    onChange?: (pageId: string) => unknown,
}

/**
 * Searchable singleSelect for confluence pages
 *
 * @param disabledPageIds
 * pageIds to be filter out of the cql search
 * @param defaultValuePageId
 * defaultValue for pre-selected page
 * @param onChange
 * callback to be invoked with newly created pageId
 */
export function PageSelect({disabledPageIds = [], defaultValuePageId, onChange}: Props) {
    const preselectedPage = useAsync(async () => {
        if (!defaultValuePageId) {
            return null;
        }
        const response = await requestConfluence(`/rest/api/content/` + defaultValuePageId);
        console.log(response.status);
        if (!response.ok) {
            if (response.status === 403) {
                return {
                    label: <PageSelectLabel title={"Locked page"} locked subtitle={defaultValuePageId}/>,
                    value: defaultValuePageId,
                }
            }
            return {
                label: <PageSelectLabel title={"Unknown page"} unknown subtitle={defaultValuePageId}/>,
                value: defaultValuePageId,
            }
        }
        const page = await response.json() as PageFromContentAPI;
        return {
            label: <PageSelectLabel title={page.title} subtitle={page.space.name}/>,
            value: defaultValuePageId,
        }
    }, [defaultValuePageId]);
    const search = async (searchTerm: string) => {
        const response = await requestConfluence(`/rest/api/search?cql=type=page and title~"${searchTerm}"`);
        if (!response.ok) {
            return [];
        }
        const searchResult = await response.json() as CqlSearchResult;
        return searchResult.results
            .filter(result => !disabledPageIds.includes(result.content.id))
            .map(result => {
                return {
                    label: <PageSelectLabel title={result.content.title}
                                            subtitle={result.resultGlobalContainer.title}/>,
                    value: result.content.id
                }
            });
    }

    if (defaultValuePageId && preselectedPage.loading) {
        return <AsyncSelect
            key="disabled-page-select"
            placeholder={<SkeletonItem isShimmering cssFn={css => ({padding: 0, width: "250px"})}/>}
            isLoading
            isDisabled
        />
    }

    return <AsyncSelect
        isLoading={preselectedPage.loading}
        isDisabled={preselectedPage.loading}
        loadOptions={search}
        defaultValue={defaultValuePageId && preselectedPage.value}
        defaultOptions
        onChange={change => onChange && onChange((change as { value: string, label: ReactElement }).value)}
        inputId="page-select"
    />

}

const PageSelectLabel = styled(({
                                    title,
                                    subtitle,
                                    className,
                                    locked,
                                    unknown,
                                }: { title: string, subtitle: string, className?: string, locked?: boolean, unknown?: boolean }) => (
    <span className={className}>
        <span className="title">
            {locked && <LockIcon label="lock-icon" size="medium"/>}
            {unknown && <QuestionIcon label="question-icon" size="medium"/>}
            {title} <span className="subtitle">{subtitle}</span>
        </span>
    </span>
))
    `
      .title {
        display: flex;
        align-items: center;

        [aria-label="lock-icon"] {
          padding-right: 0.25rem;
        }
      }

      .subtitle {
        color: rgb(107, 119, 140);
        padding-left: 0.25rem;
      }
    `

interface CqlSearchResult {
    results: Result[];
    start: number;
    limit: number;
    size: number;
    totalSize: number;
    cqlQuery: string;
    searchDuration: number;
    _links: CqlSearchResultLinks;
}

interface CqlSearchResultLinks {
    base: string;
    context: string;
    self: string;
}

interface Result {
    content: Content;
    title: string;
    excerpt: string;
    url: string;
    resultGlobalContainer: ResultGlobalContainer;
    breadcrumbs: any[];
    entityType: string;
    iconCssClass: string;
    lastModified: Date;
    friendlyLastModified: string;
    score: number;
}

interface Content {
    id: string;
    type: string;
    status: string;
    title: string;
    childTypes: ChildTypes;
    macroRenderedOutput: ChildTypes;
    restrictions: ChildTypes;
    _expandable: Expandable;
    _links: ContentLinks;
}

interface Expandable {
    container: string;
    metadata: string;
    extensions: string;
    operations: string;
    children: string;
    history: string;
    ancestors: string;
    body: string;
    version: string;
    descendants: string;
    space: string;
}

interface ContentLinks {
    webui: string;
    self: string;
    tinyui: string;
}

interface ChildTypes {
}

interface ResultGlobalContainer {
    title: string;
    displayUrl: string;
}

export interface PageFromContentAPI {
    id: string;
    type: string;
    status: string;
    title: string;
    space: Space;
    history: History;
    version: Version;
    macroRenderedOutput: MacroRenderedOutput;
    extensions: Extensions;
    _expandable: PageFromContentAPIExpandable;
    _links: PageFromContentAPILinks;
}

export interface PageFromContentAPIExpandable {
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

export interface PageFromContentAPILinks {
    editui: string;
    webui: string;
    context: string;
    self: string;
    tinyui: string;
    collection: string;
    base: string;
}

export interface Extensions {
    position: number;
}

export interface History {
    latest: boolean;
    createdBy: CreatedBy;
    createdDate: Date;
    _expandable: HistoryExpandable;
    _links: HistoryLinks;
}

export interface HistoryExpandable {
    lastUpdated: string;
    previousVersion: string;
    contributors: string;
    nextVersion: string;
}

export interface HistoryLinks {
    self: string;
}

export interface CreatedBy {
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

export interface CreatedByExpandable {
    operations: string;
    personalSpace: string;
}

export interface ProfilePicture {
    path: string;
    width: number;
    height: number;
    isDefault: boolean;
}

export interface MacroRenderedOutput {
}

export interface Space {
    id: number;
    key: string;
    name: string;
    type: string;
    status: string;
    _expandable: SpaceExpandable;
    _links: SpaceLinks;
}

export interface SpaceExpandable {
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

export interface SpaceLinks {
    webui: string;
    self: string;
}

export interface Version {
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

export interface VersionExpandable {
    collaborators: string;
    content: string;
}
