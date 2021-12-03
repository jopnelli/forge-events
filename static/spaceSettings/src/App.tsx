import React from "react";
import styled from "styled-components";

function App() {

    const AppWrapper = styled.div`padding-top: 0rem;
      max-width: 1200px;`

    return (
        <AppWrapper>
            <h1>Hello World!</h1>
            <p>When you see this, you successfully started the typescript template for a new Forge app! Feel free to add some changes here.</p>
        </AppWrapper>
    );
}

export default App;
