import React, { Component } from 'react';
import { Main } from '../main';
import Header from './auth/header'

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

// const App = () => (
//   <div>
//     <Main />
//   </div>
// );
