import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/navbar/page/Navbar';

import SignIn from './components/login/signin/SignIn';

import UsersPage from './components/users/page/UsersPage';

import NotFound from './components/notfound/page/NotFound';

import UserPage from './components/user/page/UserPage';

function App() {
  return (
    <Router>
      <div className="App">
        {/* All the routes: default to projects */}
        <Navbar/>
        <Routes>
          {/* Login route */}
          <Route path="/login" exact element={<SignIn/>} />
            
          {/* Users route */}
          <Route path="/users" exact element={<UsersPage/>} />
        
          {/* Specific user: */}
          <Route path="/user/:user" exact element={<UserPage/>} />   

          {/* Specific user: */}
          <Route path="/" exact element={<Navigate to="/users"/>} />  

          {/* Not found page */}
          <Route path="*" exact element={<NotFound/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
