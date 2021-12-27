import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import './App.css';
import views from 'views'
import services from 'services'

function App() {
  return (
    <BrowserRouter>
      <views.Wrapper>
        <Routes>
          <Route path={services.linking.path('Domain')} element={<views.Domain/>} />
          <Route path={services.linking.path('Landing')} element={<views.Landing />} />
          <Route path={services.linking.path('MyDomains')} element={<views.MyDomains />} />
          <Route path={services.linking.path('Register')} element={<views.Register />} />
          <Route path={services.linking.path('SunriseAuction')} element={<views.SunriseAuction />} />
        </Routes>
      </views.Wrapper>
    </BrowserRouter>
  );
}

export default App;
