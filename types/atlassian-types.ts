export interface CqlSearchResult {
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

type Unarray<T> = T extends Array<infer U> ? U : T;
export type ConfluencePageSearchResult = Unarray<Result>

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
