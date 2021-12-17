import React, {useContext, useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import {PageSelect} from "shared/PageSelect";
import {LanguageSelect} from "shared/LanguageSelect";
import {AtlassianContext} from "shared/AtlassianContext";
import {useAsyncFn} from "react-use";
import {createLinks, getLinks} from "shared/api";
import Button, {LoadingButton} from "@atlaskit/button";
import {LinkRequestItem} from "shared-types/types";
import TrashIcon from '@atlaskit/icon/glyph/trash';
import UndoIcon from '@atlaskit/icon/glyph/undo';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import {router, view} from "@forge/bridge";
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import InlineMessage from "@atlaskit/inline-message";
import ContentLoader, {IContentLoaderProps} from "react-content-loader"

const MAX_LINKS = 10;

function App() {
    const atlassianContext = useContext(AtlassianContext);
    const currentPageId: number = parseInt(atlassianContext.forgeContext.extension.content.id);
    const [pageLinks, fetch] = useAsyncFn(async () => {
        const loadedLinks = await getLinks();
        const newPageLinks: LinkRequestItemEditState[] = !loadedLinks.length ? [{
            pageId: currentPageId,
            languageISO2: null,
        }] : loadedLinks.map(({pageId, languageISO2, url}) => ({pageId, languageISO2, url}));
        setNewPageLinks(newPageLinks);
        return newPageLinks;
    })
    const currentPageLanguageLink = useMemo(() => pageLinks.value?.find(link => link.pageId === currentPageId) || null, [pageLinks, currentPageId]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    type LinkRequestItemEditState = { pageId: number | null, languageISO2: string | null, removed?: boolean, url?: string };
    const [newPageLinks, setNewPageLinks] = useState<LinkRequestItemEditState[]>([]);
    const [saveState, save] = useAsyncFn(async () => {
        const linkRequest = newPageLinks
            .filter(link => !link.removed)
            .map(link => ({
                languageISO2: link.languageISO2,
                pageId: link.pageId
            })) as LinkRequestItem[];
        await createLinks(linkRequest);
        await view.close({canceled: false})
    }, [newPageLinks])

    const updatePageLink = (pageId: number | null, languageLinkUpdate: Partial<LinkRequestItemEditState>) =>
        setNewPageLinks(prevState =>
            prevState.map(link => pageId !== link.pageId ? link : {...link, ...languageLinkUpdate})
        )

    const addEmptyEditPageLink = () => setNewPageLinks(prevState => [...prevState, {pageId: null, languageISO2: null}]);
    const addEditPageLinks = (links: LinkRequestItemEditState[]) => {
        setNewPageLinks(prevState => [...prevState, ...links]);
    };

    const selectedPageIds = useMemo(() => newPageLinks
        .map(link => link.pageId)
        .filter(pageId => pageId)
        .map(pageId => pageId!.toString()), [newPageLinks]);

    const selectedLanguageCodes = useMemo(() => newPageLinks.filter(link => !link.removed).map(link => link.languageISO2).filter(language => language) as string[], [newPageLinks]);
    const [pageSelectionState, pageSelection] = useAsyncFn(async (oldPageId: number | null, newPageId: number) => {
        updatePageLink(oldPageId, {
            pageId: newPageId,
        });
        const loadedLinks = await getLinks(newPageId);
        const loadedLinkOfSelectedPage = loadedLinks.find(link => link.pageId === newPageId);
        updatePageLink(oldPageId, {
            pageId: newPageId,
            languageISO2: loadedLinkOfSelectedPage?.languageISO2,
            url: loadedLinkOfSelectedPage?.url
        });
        addEditPageLinks(
            loadedLinks
                .filter(link => link.pageId !== newPageId)
                .filter(link => !selectedPageIds.includes(link.pageId.toString()))
        );
    })

    const onLinkRemove = (pageId: number | null, removed: boolean) => {
        if (pageId) {
            updatePageLink(pageId, {removed})
        } else {
            setNewPageLinks(prevState => {
                const links = [...prevState];
                links.pop();
                return links;
            })
        }
    }

    const isLanguageDuplicates = useMemo(() => {
        return selectedLanguageCodes.length > new Set(selectedLanguageCodes).size
    }, [selectedLanguageCodes]);

    const isAddingLinkAllowed = useMemo(() => {
        const lastLink = [...newPageLinks].pop();
        return lastLink && lastLink.languageISO2 && lastLink.pageId && newPageLinks.length < MAX_LINKS && !pageSelectionState.loading
    }, [newPageLinks, pageSelectionState]);

    const isSavingAllowed = useMemo(() => {
        return !isLanguageDuplicates && !pageLinks.loading
    }, [isLanguageDuplicates, pageLinks])

    return (
        <AppWrapper>
            <Header>
                <Headline>Configure language links</Headline>
            </Header>
            <Configuration>
                <Description>Define the language of the current page and links to existing language
                    variants.</Description>
                <Caption>
                    Current page
                </Caption>

                {!pageLinks.loading ?
                    <Row>
                        <PageSelect disabled defaultValuePageId={currentPageId.toString()}/>
                        <LanguageSelect defaultValue={currentPageLanguageLink?.languageISO2}
                                        disabledLanguageCodes={selectedLanguageCodes}
                                        onChange={languageCode => updatePageLink(currentPageId, {
                                            languageISO2: languageCode,
                                            pageId: currentPageId
                                        })}/>
                    </Row> : <RowLoader/>}
                <Caption>
                    Linked pages
                </Caption>
                {!pageLinks.loading ? newPageLinks.filter(link => link.pageId !== currentPageId).map((link, index) =>
                    <Row
                        borders
                        first={index === 0}
                        key={link.pageId}>
                        <PageSelect
                            defaultValuePageId={link.pageId?.toString()}
                            disabledPageIds={selectedPageIds}
                            disabled={link.removed}
                            onChange={pageId => pageSelection(link.pageId, parseInt(pageId))}
                        />
                        <LanguageSelect defaultValue={link.languageISO2}
                                        disabledLanguageCodes={selectedLanguageCodes}
                                        disabled={link.removed}
                                        busy={([...newPageLinks].pop()?.pageId === link.pageId) && pageSelectionState.loading}
                                        onChange={languageCode => updatePageLink(link.pageId, {languageISO2: languageCode})}/>
                        <Button onClick={() => link.url && router.open(link.url)}>
                            <ShortcutIcon label="external" size="small"/>
                        </Button>
                        <Button onClick={() => onLinkRemove(link.pageId, !link.removed)}>
                            {link.removed ? <UndoIcon label="undo" size="small"/> :
                                <TrashIcon label="trash" size="small"/>}
                        </Button>
                    </Row>) : <><RowLoader/><RowLoader/></>}
                <LinkControls>
                    <Button iconBefore={<EditorAddIcon label="add"/>} className="grid-1" onClick={addEmptyEditPageLink}
                            isDisabled={!isAddingLinkAllowed}>Add link</Button>
                    {isLanguageDuplicates && <InlineMessage
                        type="warning"
                        secondaryText="Please remove duplicated languages from you configuration"
                    >
                        <p>
                            <strong>Language used more than once</strong>
                        </p>
                        <p>
                            No can not use a language more than once. Please review your configuration, change the
                            language
                            association or remove invalid links.
                        </p>
                    </InlineMessage>}
                </LinkControls>
                {saveState.error && <SaveError><InlineMessage
                    type="warning"
                    secondaryText="Saving language links failed">
                    <p>
                        <strong>Please review your configuration</strong>
                    </p>
                    <p>
                        ({saveState.error.name}) {saveState.error.message}
                    </p>
                </InlineMessage></SaveError>}
            </Configuration>
            <Footer>
                <Controls>
                    <LoadingButton className="grid-1" appearance={"primary"} isDisabled={!isSavingAllowed}
                                   onClick={save}
                                   isLoading={saveState.loading}>Save</LoadingButton>
                    <Button className="grid-2" appearance="link"
                            onClick={() => view.close({canceled: true})}>Cancel</Button>
                </Controls>
            </Footer>
        </AppWrapper>
    );
}

const AppWrapper = styled.div`
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 100%;
`

const Configuration = styled.div`
  padding: 0 1rem;
`


const SaveError = styled.div`
    padding-top: 1rem;
`

const Header = styled.div`
  border-bottom: 2px solid #EBECF0;
  padding: 1rem;
  background-image: url("./globe.png");
  background-repeat: no-repeat;
  background-position-y: 8px;
  background-position-x: calc(100% - 16px);
  background-size: 50px;
`

const LinkControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Footer = styled.div`
  border-top: 2px solid #EBECF0;
  padding: 1rem;
`

const Controls = styled.div`
  display: grid;
  grid-template-columns: auto min-content min-content;
  grid-template-areas: "empty grid1 grid2";
  gap: 1rem;

  .grid-1 {
    grid-area: grid1;
  }

  .grid-2 {
    grid-area: grid2;
  }
`

const Headline = styled.h1`
  font-size: 20px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -.008em;
  text-transform: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Description = styled.p`
  padding: 1rem 0;
`

const Row = styled.div<{ first?: boolean, borders?: boolean }>`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 330px auto 40px 40px;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: ${({borders}) => borders ? "1px solid #dfe1e5;" : "none"}
`

const Caption = styled.div`
  color: #6B778C;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.45455;
  text-transform: uppercase;
  padding-bottom: 0.5rem;
`

const RowLoader = (props: IContentLoaderProps) => (
    <ContentLoader
        speed={2}
        width={466}
        height={43}
        viewBox="0 0 466 43"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
    >
        <rect x="1" y="1" rx="3" ry="3" width="330" height="32"/>
        <rect x="339" y="1" rx="0" ry="0" width="133" height="31"/>
    </ContentLoader>
)

export default App;
