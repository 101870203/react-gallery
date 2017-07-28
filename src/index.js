

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';


const render = () => {
    ReactDOM.render( <App/>,document.querySelector("#root"));
};



render(App);

// 模块热替换的 API
if (process.env.NODE_ENV !== 'development' && module.hot) {
  module.hot.accept('./components/App', () => {
    render(App)
  });
}
