import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux'

import configureStore from '../src/store';
import reducers from './reducers';
import middlewares from './middlewares';

import createRoutes from '../src/routes';
import rootSaga from './sagas';
import { sagaMiddleware } from './middlewares'
import '../src/styles/main.scss';

export const store = configureStore(reducers, middlewares);
const routes = createRoutes();
const root = document.getElementById('app');
export const history = createHistory();

sagaMiddleware.run(rootSaga);

const runApp = (routes) => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        {routes}
      </ConnectedRouter>
    </Provider>,
    root
  );
};

if (module.hot && DEV_ENV) {
  module.hot.accept('../src/routes', () => {
    import('../src/routes')
      .then(({ default: routes }) => runApp(routes()))
  })
}

runApp(routes);

