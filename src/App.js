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
      </Routes>
    </views.Wrapper>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Inner />
    </BrowserRouter>
  )
}

export default App;
