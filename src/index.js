import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/weather-icons.min.css';
import App from './views/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
