import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
 import EventsPage from './EventsPage'
 import EventDetail from './EventDetail'
 import ProfilePage from './ProfilePage';
 import FavoritesPage from './FavoritesPage'; // Создайте этот компонент
import SecurityPage from './CartPage'; // Создайте этот компонент
 import BackgroundLogo from './BackgroundLogo';
function App() {

  return (
    <Router>
      <div className="App">
        <BackgroundLogo /> {/* Добавляем компонент фона */}
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<EventsPage />} />

            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/security" element={<SecurityPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;