import React, { Component } from 'react';
import { Main } from '../main';
import Header from './auth/header';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gmapLoaded: false
    };
  }

  componentWillMount() {
    //make initMap callback global
    window.initMap = this.loadedMap;
    const API_KEY = process.env.GOOGLEMAP_API_KEY;
    // console.log('in app.js, compoenentWillMount, API_KEY: ', API_KEY)
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`;
    // added async and defer to make sure gmap loads before component...
    // https://medium.com/@nikjohn/speed-up-google-maps-and-everything-else-with-async-defer-7b9814efb2b
    // https://stackoverflow.com/questions/41289602/add-defer-or-async-attribute-to-dynamically-generated-script-tags-via-javascript/41289721
    script.async = true;
    script.defer = true;
    document.head.append(script);
  }

  loadedMap = () => {
      this.setState({ gmapLoaded: true });
      // console.log('in app.js, loadedMap,  loaded!');
      console.log('in app.js, loadedMap,  this.state.gmapLoaded: ', this.state.gmapLoaded);
      // return true;
  }

  renderApp() {
      if (this.state.gmapLoaded) {
      console.log('in app.js, renderApp, after if, this.state.gmapLoaded', this.state.gmapLoaded);
      return (
        <div>
          <Header />
          <Main />
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderApp()}
      </div>
    );
  }
  // render() {
  //   return (
  //     <div>
  //       <Header />
  //       <Main />
  //     </div>
  //   );
  // }
}
