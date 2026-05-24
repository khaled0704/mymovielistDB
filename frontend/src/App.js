import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetail from './pages/MovieDetail';
import MyLists from './pages/MyLists';
import Profile from './pages/Profile';
import ListDetail from './pages/ListDetail'; 
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/my-lists" element={<MyLists />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lists/:id" element={<ListDetail />} />
        <Route path="/user/:userId" element={<UserProfile />} />


      </Routes>
    </Router>
  );
}

export default App;