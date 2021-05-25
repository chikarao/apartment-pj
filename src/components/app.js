import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Main } from '../main';
import Header from './auth/header';

// let searchPlaceLanguageChanged = false;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gmapLoaded: false
    };
  }

  componentDidMount() {
    // console.log('in app.js, componentDidMount, this.props: ', this.props);
    // placeSearchLanguageCode needed to reload google map api on to the page,
    // otherwise, multiple googlemap scripts will be loaded and cause problems
    // When user clicks on difference language, in map_interaction.js, sets state placeSearchLanguageCode,
    // and componentDidUpdate is triggered. the language code is stored in localStorage,
    // When page reloaged, state placeSearchLanguageCode is updated on index.js from localstorage
    const placeSearchLanguageCode = localStorage.getItem('placeSearchLanguageCode');
    if (placeSearchLanguageCode) {
      // console.log('in app.js, componentDidMount, if, placeSearchLanguageCode: ', placeSearchLanguageCode);
      this.loadMap(placeSearchLanguageCode);
      // this.props.placeSearchLanguageCode(mapLanguage, () => {});
      // localStorage.removeItem('placeSearchLanguageCode')
    } else {
      // console.log('in app.js, componentDidMount, else, placeSearchLanguageCode: ', placeSearchLanguageCode);
      this.loadMap(this.props.placeSearchLanguageCode);
    }

    const searchPlaceLanguageChanged = localStorage.getItem('searchPlaceLanguageChanged');

    // if (!searchPlaceLanguageChanged) {
    //   localStorage.removeItem('xPositionForMap');
    //   localStorage.removeItem('yPositionForMap');
    // }
    // localStorage.setItem('searchPlaceLanguageChanged', false);
    // console.log('in app.js, componentDidMount, window, document: ', window, document);
  }

  componentDidUpdate(prevProps) {
    // console.log('in app.js, componentDidUpdate, this.props: ', this.props);

    if (this.props.placeSearchLanguageCode !== prevProps.placeSearchLanguageCode) {
      localStorage.setItem('placeSearchLanguageCode', this.props.placeSearchLanguageCode);
      // console.log('in app.js, componentDidUpdate,  this.props.language, prevProps.language: ', this.props.placeSearchLanguageCode, prevProps.placeSearchLanguageCode);
      // this.loadMap();
      // document.location = document.URL;
      // window.location.href;
      // window.location = document.URL;
      // console.log('in app.js, componentDidUpdate, window, document: ', window, document);
      document.location.reload(false);
      // window.location.reload(false);
      // window.location.assign();
      // localStorage.setItem('searchPlaceLanguageChanged', true);
    }
  }

  loadMap(language) {
    //make initMap callback global
    // console.log('in app.js, componentWillMount,  this.props.language: ', this.props.language);
    window.initMap = this.loadedMap;
    const API_KEY = process.env.GOOGLEMAP_API_KEY;
    // console.log('in app.js, componentWillMount, API_KEY: ', API_KEY)
    // https://developers.google.com/maps/documentation/javascript/versions
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&language=${language}&callback=initMap`;
    // script.src = `https://maps.googleapis.com/maps/api/js?v=3.45&key=${API_KEY}&libraries=places&language=${language}&callback=initMap`;
    // script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&language=${this.props.placeSearchLanguageCode}&callback=initMap`;
    // added async and defer to make sure gmap loads before component...
    // https://medium.com/@nikjohn/speed-up-google-maps-and-everything-else-with-async-defer-7b9814efb2b
    // https://stackoverflow.com/questions/41289602/add-defer-or-async-attribute-to-dynamically-generated-script-tags-via-javascript/41289721
    script.async = true;
    script.defer = true;
    document.head.append(script);

    // Does not work; no way to do a call back
    // No issues with exposing app id; Since user needs to know for any unwanted activity
    // reference: https://stackoverflow.com/questions/33572477/is-there-a-way-to-hide-my-facebook-appid
    // const FB_API_KEY = process.env.FACEBOOK_APP_ID;
    // const fbScript = document.createElement('script');
    // fbScript.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.1&appId=${FB_API_KEY}&autoLogAppEvents=1`;
    // // fbScript.async = true;
    // // fbScript.defer = true;
    // document.head.append(fbScript);
  }

  loadedMap = () => {
      this.setState({ gmapLoaded: true });
      // console.log('in app.js, loadedMap,  loaded!');
      // console.log('in app.js, loadedMap,  this.state.gmapLoaded: ', this.state.gmapLoaded);
      // return true;
  }

  renderApp() {
    // console.log('in app.js, renderApp, after if, this.state.gmapLoaded', this.state.gmapLoaded);
    if (this.state.gmapLoaded) {
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
//
function mapStateToProps(state) {
  console.log('in app.js, mapStateToProps, state: ', state);
  return {
    placeSearchLanguageCode: state.languages.placeSearchLanguageCode,
    appLanguageCode: state.languages.appLanguageCode
    // conversation: state.conversation.createMessage
  };
}

export default withRouter(connect(mapStateToProps)(App));
// export default App;
