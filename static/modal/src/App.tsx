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
import {router} from "@forge/bridge";
import Spinner, {Size} from '@atlaskit/spinner';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';

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
        await fetch();
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

    const selectedLanguageCodes = useMemo(() => newPageLinks.map(link => link.languageISO2).filter(language => language) as string[], [newPageLinks]);
    const [pageSelectionState, pageSelection] = useAsyncFn(async (oldPageId: number | null, newPageId: number) => {
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

    const isAddingLinkAllowed = useMemo(() => {
        const lastLink = [...newPageLinks].pop();
        return lastLink && lastLink.languageISO2 && lastLink.pageId && newPageLinks.length < MAX_LINKS && !pageSelectionState.loading
    }, [newPageLinks, pageSelectionState]);

    if (pageLinks.loading) {
        return <div>Loading...</div>;
    }

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
                <Row>
                    <PageSelect disabled defaultValuePageId={currentPageId.toString()}/>
                    <LanguageSelect defaultValue={currentPageLanguageLink?.languageISO2}
                                    onChange={languageCode => updatePageLink(currentPageId, {
                                        languageISO2: languageCode,
                                        pageId: currentPageId
                                    })}/>
                </Row>
                <Caption>
                    Linked pages
                </Caption>
                {
                    newPageLinks.filter(link => link.pageId !== currentPageId).map((link, index) => <Row
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
                                        onChange={languageCode => updatePageLink(link.pageId, {languageISO2: languageCode})}/>
                        <Button onClick={() => link.url && router.open(link.url)}>
                            <ShortcutIcon label="external" size="small"/>
                        </Button>
                        <Button onClick={() => onLinkRemove(link.pageId, !link.removed)}>
                            {link.removed ? <UndoIcon label="undo" size="small"/> :
                                <TrashIcon label="trash" size="small"/>}
                        </Button>

                    </Row>)
                }
                {pageSelectionState.loading &&
                <span>Resolving<Spinner size="small"/></span>
                }
                <Button iconBefore={<EditorAddIcon label="add"/>} className="grid-1" onClick={addEmptyEditPageLink}
                        isDisabled={!isAddingLinkAllowed}>Add link</Button>
            </Configuration>
            <Footer>
                <Controls>
                    <LoadingButton className="grid-1" appearance={"primary"} onClick={save}
                                   isLoading={saveState.loading}>Save</LoadingButton>
                    <Button className="grid-2" appearance="link" onClick={addEmptyEditPageLink}
                            isDisabled={!isAddingLinkAllowed}>Cancel</Button>
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


const Header = styled.div`
  border-bottom: 2px solid #EBECF0;
  padding: 1rem;
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
`

const Description = styled.p`
  padding: 1rem 0;
`

const Row = styled.div<{first?: boolean, borders?: boolean}>`
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

export default App;
