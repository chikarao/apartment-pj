// import React, { Component } from 'react';

const FacebookLogin = () => {
  // console.log('in SigninModal, facebookLogin FB', FB);
  window.fbAsyncInit = function() {
    FB.init({
      appId            : '2249093511770692',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.1'
    });

    FB.Event.subscribe('auth.statusChange', (response) => {
      if (response.authResponse) {
        this.updateLoggedInState(response)
      } else {
        this.udpateLoggedInState()
      }
    });
    console.log('in FacebookLogin, facebookLogin, after subscribe, this', this);
}

return true;
// don't need to bind; FB button will not show up
//.bind(this);
// for some reason need this again...
  (function(d, s, id) {
     var js, fjs = d.getElementsByTagName(s)[0];
     console.log('in SigninModal, facebookLogin, in lower function');
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}

export default FacebookLogin;
