import React, {useContext} from "react";
import styled from "styled-components";
import Form, {ErrorMessage, Field} from '@atlaskit/form';
import Button from "@atlaskit/button";
import TextField from '@atlaskit/textfield';
import {view} from '@forge/bridge';
import {NoteCreatePayload, noteCreatePayloadSchema} from "shared-types/note";
import {AtlassianContext} from "shared/AtlassianContext";

function App() {
    const {forgeContext} = useContext(AtlassianContext);
    const submit = async (data: NoteCreatePayload) => {
        view.close(data);
    }
    const validateNote = (value?: string) => {
        return noteCreatePayloadSchema.extract("msg").validate(value).error?.message;
    };

    return (
        <AppWrapper>
            <Form<NoteCreatePayload> onSubmit={submit}>
                {({formProps}) => (
                    <form {...formProps}>
                        <Field name="msg" defaultValue={forgeContext.extension.modal.note.msg} label="A note for that page." validate={validateNote}
                               isRequired>
                            {({fieldProps, error}) => <>
                                <TextField {...fieldProps} />
                                {
                                    error && <ErrorMessage>{error}</ErrorMessage>
                                }
                            </>}
                        </Field>
                        <Toolbar>
                            <Button type="submit" appearance="primary">
                                Submit
                            </Button>
                        </Toolbar>
                    </form>
                )}
            </Form>
        </AppWrapper>
    );
}

const AppWrapper = styled.div`
  padding: 0 1rem;
`
const Toolbar = styled.div`
  padding-top: 1rem;
`

export default App;
