import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'
import './App.css';

import views from 'views'
import services from 'services'


function Inner() {
  const location = useLocation()
  React.useEffect(() => {
    services.linking.routeChanged()
  }, [location])
  return (
    <views.Wrapper>
      <Routes>
        <Route path={services.linking.path('Domain')} element={<views.Domain/>} />
        <Route path={services.linking.path('Landing')} element={<views.Landing />} />
        <Route path={services.linking.path('MyDomains')} element={<views.MyDomains />} />
        <Route path={services.linking.path('Register')} element={<views.Register />} />
        <Route path={services.linking.path('SunriseAuction')} element={<views.SunriseAuction />} />
        <Route path={services.linking.path('SunriseAuctionMyBids')} element={<views.SunriseAuction.MyBids />} />
        <Route path={services.linking.path('SetPassword')} element={<views.SetPassword />} />
        <Route path={services.linking.path('Settings')} element={<views.Settings />} />
      </Routes>
    </views.Wrapper>
  );
}

function App() {
  if (services.environment.ENVIRONMENT == 'staging') {
    return (
      <div className='flex items-center justify-center h-screen w-screen flex-col'>
        <div>
          <img src="/images/logo.png" className='w-16 h-16'/>
        </div>
        <div className='mt-4 max-w-sm text-center'>
          Thank you to everyone who participated in the testing. The test application is now closed. 
        </div>
        <div className='mt-4 max-w-sm text-center'>
          <a className='underline' href="https://twitter.com/avvydomains">Follow us on Twitter to stay updated!</a>
        </div>
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Inner />
    </BrowserRouter>
  )
}

export default App;
