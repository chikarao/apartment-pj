import React, { Component } from 'react';

const NoMatch = ({ location }) => (
  <div>
    <h3>
      (404) No match for route <code>{location.pathname}</code>.<br/><br/>

      Please go to anther page.
    </h3>
  </div>
);

export default NoMatch;
