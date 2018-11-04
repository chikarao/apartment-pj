import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Main } from '../main';
import Header from './auth/header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gmapLoaded: false
    };
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps) {
    console.log('in app.js, componentDidUpdate,  this.props.language, prevProps.language: ', this.props.placeSearchLanguageCode, prevProps.placeSearchLanguageCode);
    if (this.props.placeSearchLanguageCode !== prevProps.placeSearchLanguageCode) {
      this.loadMap();
    }
  }

  loadMap() {
    //make initMap callback global
    // console.log('in app.js, componentWillMount,  this.props.language: ', this.props.language);
    window.initMap = this.loadedMap;
    const API_KEY = process.env.GOOGLEMAP_API_KEY;
    // console.log('in app.js, componentWillMount, API_KEY: ', API_KEY)
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&language=${this.props.placeSearchLanguageCode}&callback=initMap`;
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
      if (this.state.gmapLoaded) {
      // console.log('in app.js, renderApp, after if, this.state.gmapLoaded', this.state.gmapLoaded);
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
    placeSearchLanguageCode: state.languages.placeSearchLanguageCode
    // conversation: state.conversation.createMessage
  };
}

export default connect(mapStateToProps)(App);
// export default App;
