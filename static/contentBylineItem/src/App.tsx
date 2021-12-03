import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import Button from "@atlaskit/button";
import {Modal} from '@forge/bridge';
import {getPageNote, savePageNote} from "shared/note-api";
import {useAsyncFn} from "react-use";
import {Note, NoteCreatePayload} from "../../../types/note";
import {SkeletonItem} from "@atlaskit/menu";
import {AsyncUser} from "shared/AsyncUser";

/**
 * contentBylineItem that renders a note below every pageTitle
 * it fetches the note for the current page and opens a modal to allow editing of the value
 */
function App() {
    const [fetchingState, fetchNote] = useAsyncFn(async () => {
        const note = await getPageNote();
        setPageNote(note);
    }, []);

    const [savingState, saveNote] = useAsyncFn(async (payload: NoteCreatePayload) => {
        await savePageNote(payload);
    }, []);

    const isLoading = useMemo(() => fetchingState.loading || savingState.loading, [fetchingState, savingState]);

    const [pageNote, setPageNote] = useState<Note | null>(null);

    useEffect(() => {
        fetchNote()
    }, [fetchNote]);

    const openModal = () => {
        const modal = new Modal({
            resource: "modal-res",
            context: {note: pageNote}, // will be passed to modal
            async onClose(payload: NoteCreatePayload) {
                await saveNote(payload);
                await fetchNote();
            },
        });
        modal.open();
    };

    if (fetchingState.error || savingState.error) {
        return <span>{fetchingState.error?.message || savingState.error?.message || "Unknown Error"}</span>;
    }

    if (isLoading || !pageNote) {
        return <>
            {[1, 2].map(_ =>
                <SkeletonItem key={_}
                              isShimmering
                              cssFn={css => ({padding: 0, "min-height": "25px", "border-radius": "0"})}/>
            )}
        </>
    }

    return (
        <AppWrapper>
            <Headline>
                Page note
            </Headline>
            {
                pageNote.creator && <AsyncUser accountId={pageNote.creator}/>
            }
            <Message>{pageNote.msg}</Message>
            <Actions>
                <Button onClick={openModal} appearance="subtle">Edit</Button>
            </Actions>
        </AppWrapper>
    );


}

const AppWrapper = styled.div``
const Message = styled.div`
  font-style: italic;
`
const Headline = styled.h1`
  font-size: 12px;
  text-transform: uppercase;
  padding-bottom: 0.25rem;
`
const Actions = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`

export default App;
