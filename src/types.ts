// automatically generated as Atlassian doesn't provide it
// this object is provided when a forge lambda is invoked from a Confluence page. may differ in other locations.
export interface ForgePageInvocationContext {
    cloudId:        string;
    localId:        string;
    moduleKey:      string;
    extension:      Extension;
    installContext: string;
    accountId:      string;
}

export interface Extension {
    type:    string;
    content: Content;
    space:   Space;
}

export interface Content {
    id:   string;
    type: string;
}

export interface Space {
    key: string;
}
