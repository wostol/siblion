import React from 'react';
import './Loader.css'; // создадим отдельный CSS файл

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Загрузка...</p>
    </div>
  );
};

export default Loader;