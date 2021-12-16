import React from "react";
import styled from "styled-components";
import {LanguageOverview} from "./LanguageOverview";

function App() {
    return (
        <AppWrapper>
            <LanguageOverview />
        </AppWrapper>
    );


}
const AppWrapper = styled.div`height: auto; padding: 0 0.05rem`

export default App;
