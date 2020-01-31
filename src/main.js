import React from 'react';
import { Switch, Route } from 'react-router-dom';

// import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
// import Signup from './components/auth/signup';
// import ResetPassword from './components/auth/reset_password';
import Results from './components/results';
import Landing from './components/landing';
import ShowFlat from './components/show_flat';
import MyPage from './components/my_page';
import BookingConfirmation from './components/booking_confirmation';
import CreateFlat from './components/create_flat';
import EditFlat from './components/edit_flat';
import BookingRequest from './components/booking_request';
// NoMatch for when user inputs url that does not exist
import NoMatch from './components/no_match';
// MessagingMain works with conversation.rb and messaging.rb 
import MessagingMain from './components/messaging_main';
import StripeRedirect from './components/payments/stripe_redirect';
// higher order componenet to test if user authented when navigating to page
import RequireAuth from './components/auth/require_auth';

// pages that are no longer used after implementing modals in /auth
// <Route path='/signup' component={Signup} />
// <Route path='/signin' component={Signin} />
// <Route path='/resetpassword' component={ResetPassword} />

export const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Landing} />
      <Route path='/signout' component={Signout} />
      <Route path='/show/:id' component={ShowFlat} />
      <Route path='/results' component={Results} />
      <Route path='/mypage' component={RequireAuth(MyPage)} />
      <Route path='/editflat/:id' component={RequireAuth(EditFlat)} />
      <Route path='/bookingconfirmation/:id' component={RequireAuth(BookingConfirmation)} />
      <Route path='/bookingrequest' component={RequireAuth(BookingRequest)} />
      <Route path='/createflat' component={RequireAuth(CreateFlat)} />
      <Route path='/messagingmain' component={RequireAuth(MessagingMain)} />
      <Route path='/striperedirect/:params' component={RequireAuth(StripeRedirect)} />
      <Route component={NoMatch} />
    </Switch>
  </main>
);
