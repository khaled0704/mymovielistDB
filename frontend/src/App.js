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
import AdminDashboard from './pages/AdminDashboard';
import AdminMovies from './pages/AdminMovies';
import AdminUsers from './pages/AdminUsers';

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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<AdminMovies />} />
        <Route path="/admin/users" element={<AdminUsers />} />

      </Routes>
    </Router>
  );
}

export default App;