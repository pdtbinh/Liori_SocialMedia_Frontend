import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { RouteProvider } from './providers/routeProvider/RouteProvider';
import { initialRoute, routeReducer } from './providers/routeProvider/routeState';
import Background from './components/background/Background';
ReactDOM.render(
  <React.StrictMode> 
    <RouteProvider reducer={routeReducer} initialState={initialRoute}>
      <Background/>
      <App />
    </RouteProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
