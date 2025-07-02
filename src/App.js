import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import BasketballPage from './components/BasketballPage';
import VolleyballPage from './components/VolleyballPage';
import SportHeader from './components/SportHeader';

function App() {
  return (
    <Router>
      <SportHeader />
      <main className="App-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<BasketballPage />} />
            <Route path="/vball" element={<VolleyballPage />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
