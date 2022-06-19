import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';
import * as serviceWorker from './serviceWorker';

// Imported necessary module
import { BrowserRouter } from 'react-router-dom';

// Imported taiwan module
import './index.css';

// Create a root.
const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container);

// Render app component
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
