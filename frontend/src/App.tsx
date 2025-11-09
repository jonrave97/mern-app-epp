import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';

function App() {
  return (
    <BrowserRouter>
      {/* Aquí podrían ir otros componentes comunes, como un header */}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
      <div>
        {/* Aquí podrían ir otros componentes comunes, como un footer */}

      </div>
    </BrowserRouter>
  );
}
export default App;
