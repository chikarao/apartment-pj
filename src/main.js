import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import ResetPassword from './components/auth/reset_password';
import Feature from './components/feature';
import Welcome from './components/welcome';
import ShowFlat from './components/show_flat';

import RequireAuth from './components/auth/require_auth';


export const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Welcome} />
      <Route path='/signin' component={Signin} />
      <Route path='/signout' component={Signout} />
      <Route path='/signup' component={Signup} />
      <Route path='/resetpassword' component={ResetPassword} />
      <Route path='/show/:id' component={ShowFlat} />
      <Route path='/feature' component={RequireAuth(Feature)} />
    </Switch>
  </main>
);
