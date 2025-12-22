import './App.css';
import Header from './component/Header';
import Footer from './component/Footer';
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
 import EventsPage from './EventsPage'
 import EventDetail from './EventDetail';
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/events/past" element={<EventsPage />} />
            <Route path="/events/upcoming" element={<EventsPage />} />
            <Route path="/event/:id" element={<EventDetail />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;