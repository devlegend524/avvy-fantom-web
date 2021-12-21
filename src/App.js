import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import './App.css';
import views from 'views'
import linkingService from 'services/linking'

function App() {
  return (
    <BrowserRouter>
      <views.Wrapper>
        <Routes>
          <Route path={linkingService.path('Landing')} element={<views.Landing />} />
          <Route path={linkingService.path('MyDomains')} element={<views.MyDomains />} />
          <Route path={linkingService.path('SunriseAuction')} element={<views.SunriseAuction />} />
        </Routes>
      </views.Wrapper>
    </BrowserRouter>
  );
}

export default App;
