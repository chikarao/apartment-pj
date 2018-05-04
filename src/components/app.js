import React, { Component } from 'react';
import { Main } from '../main';
import Header from './auth/header';

export default class App extends Component {
  componentWillMount() {
    const API_KEY = process.env.GOOGLEMAP_API_KEY;
    // console.log('in app.js, compoenentWillMount, API_KEY: ', API_KEY)
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    // added async and defer to make sure gmap loads before component...
    // https://medium.com/@nikjohn/speed-up-google-maps-and-everything-else-with-async-defer-7b9814efb2b
    script.async = true;
    script.defer = true;
    document.head.append(script);
  }

  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}
