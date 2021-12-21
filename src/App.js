import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import './App.css';
import views from './views';

function App() {
  return (
    <BrowserRouter>
      <views.Wrapper />
      <Routes>
        <Route path="/" element={<div />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
