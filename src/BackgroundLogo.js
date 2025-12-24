import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './BackgroundLogo.css';

const BackgroundLogo = () => {
  const location = useLocation();
  const [headerHeight, setHeaderHeight] = useState(100);
  const [footerHeight, setFooterHeight] = useState(100);
  const [showLogo, setShowLogo] = useState(false);

  // Используем useMemo для мемоизации массивов
  const pagesWithLogo = useMemo(() => 
    ['/', '/events/past', '/events/upcoming', '/profile', '/shop'], 
    []
  );

  const pagesWithoutLogo = useMemo(() => 
    ['/favorites', '/security'], 
    []
  );

  // Получаем высоту header и footer
  useEffect(() => {
    const updateHeights = () => {
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
      if (footer) {
        setFooterHeight(footer.offsetHeight);
      }
    };

    updateHeights();
    window.addEventListener('resize', updateHeights);
    
    return () => {
      window.removeEventListener('resize', updateHeights);
    };
  }, []);

  // Определяем, показывать ли логотип
  useEffect(() => {
    const shouldShowLogo = () => {
      const path = location.pathname;
      
      // Проверяем страницы без логотипа
      for (const page of pagesWithoutLogo) {
        if (path.startsWith(page)) {
          return false;
        }
      }
      
      // Проверяем страницы с логотипом
      for (const page of pagesWithLogo) {
        if (path === page) {
          return true;
        }
      }
      
      return false;
    };

    setShowLogo(shouldShowLogo());
  }, [location.pathname, pagesWithLogo, pagesWithoutLogo]); // Добавляем массивы в зависимости

  // Добавляем/удаляем CSS класс
  useEffect(() => {
    if (!showLogo) {
      document.body.classList.add('no-background-logo');
    } else {
      document.body.classList.remove('no-background-logo');
    }
    
    return () => {
      document.body.classList.remove('no-background-logo');
    };
  }, [showLogo]);

  if (!showLogo) {
    return null;
  }

  return (
    <div 
      className="background-logo"
      style={{
        '--header-height': `${headerHeight}px`,
        '--footer-height': `${footerHeight}px`,
      }}
    />
  );
};

export default BackgroundLogo;