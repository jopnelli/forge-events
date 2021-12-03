import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import App from "./App";
import {AtlassianContextProvider} from "shared/AtlassianContext";

ReactDOM.render(
    <AtlassianContextProvider>
        <App/>
    </AtlassianContextProvider>,
    document.getElementById('root')
);
