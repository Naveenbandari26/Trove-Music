// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import DownloadPage from './pages/DownloadPage';
import SignupPage from './pages/SignupPage';
import Admin from './components/Admin';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/' index element={<LandingPage/>} />
        <Route exact path='/signUp' element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/main" element={<MainPage/>} />
        <Route path="/download" element={<DownloadPage/>} />
        
        {/* <Route path='/admin' element={<Admin/>}/> */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    // <Dock/>
  );
};

export default App;
