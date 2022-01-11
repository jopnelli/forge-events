import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import App from "./App";
import {AtlassianContextProvider} from "shared/AtlassianContext";
import 'shared/i18n';

ReactDOM.render(
    <AtlassianContextProvider>
        <App />
    </AtlassianContextProvider>,
    document.getElementById('root')
);
