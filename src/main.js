import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import ResetPassword from './components/auth/reset_password';
import Results from './components/results';
import Landing from './components/landing';
import ShowFlat from './components/show_flat';
import MyPage from './components/my_page';
import BookingConfirmation from './components/booking_confirmation';
import CreateFlat from './components/create_flat';
import EditFlat from './components/edit_flat';
import MessagingMain from './components/messaging_main';

import RequireAuth from './components/auth/require_auth';


export const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Landing} />
      // <Route path='/signin' component={Signin} />
      <Route path='/signout' component={Signout} />
      // <Route path='/signup' component={Signup} />
      // <Route path='/resetpassword' component={ResetPassword} />
      <Route path='/show/:id' component={ShowFlat} />
      <Route path='/results' component={Results} />
      <Route path='/mypage' component={RequireAuth(MyPage)} />
      <Route path='/editflat/:id' component={RequireAuth(EditFlat)} />
      <Route path='/bookingconfirmation/:id' component={RequireAuth(BookingConfirmation)} />
      <Route path='/createflat' component={RequireAuth(CreateFlat)} />
      <Route path='/messagingmain' component={RequireAuth(MessagingMain)} />
    </Switch>
  </main>
);
