import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.render((
  <BrowserRouter>
    <App /> {/* The various pages will be displayed by the `Main` component. */}
  </BrowserRouter>
  ), document.getElementById('root')
);
// ReactDOM.render( 
//   <React.StrictMode>
//     <App />
//     </React.StrictMode>,
//     document.getElementById('root')
// );