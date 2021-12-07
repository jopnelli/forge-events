import React from "react";
import styled from "styled-components";
import Button from "@atlaskit/button";
import {Modal} from '@forge/bridge';
import {useAsyncFn} from "react-use";
import {invokeWriteToFirestore} from "shared/api";

function App() {
    const [, writeToFirestore] = useAsyncFn(async () => {
        await invokeWriteToFirestore();
    }, []);

    const openModal = () => {
        const modal = new Modal({
            resource: "modal-res",
            context: {}, // will be passed to modal
            async onClose() {},
        });
        modal.open();
    };

    return (
        <AppWrapper>
            <Headline>
                Proof of concept
            </Headline>
            <Actions>
                <Button onClick={writeToFirestore} appearance="subtle">Test</Button>
                <Button onClick={openModal} appearance="subtle">Open modal</Button>
            </Actions>
        </AppWrapper>
    );


}

const AppWrapper = styled.div``
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
