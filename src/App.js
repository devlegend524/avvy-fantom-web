import logo from './logo.svg';
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
      {/*
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="wat" element={<Wat />} />
      </Routes>
      */}
    </BrowserRouter>
  );
}

export default App;
