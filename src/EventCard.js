import './EventCard.css'
import { useNavigate } from 'react-router-dom'
const EventCard = ({ event, isPast = false }) => {
  const { 
    id,
    title, 
    date, 
    location, 
    description
    // maxParticipants,
    // currentParticipants
  } = event;
    const navigate = useNavigate();

  // Обработчик клика по карточке
  const handleCardClick = (e) => {
    // Предотвращаем переход при клике на кнопки
    if (e.target.closest('.btn') || e.target.closest('.event-actions')) {
      return;
    }
    navigate(`/event/${id}`);
  };
  // Форматирование даты
  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Форматирование времени (если нужно)
  // const formatTime = (dateString) => {
  //   const dateObj = new Date(dateString);
  //   return dateObj.toLocaleTimeString('ru-RU', {
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  // Проверка набора участников
  // const getParticipantsInfo = () => {
  //   if (isPast) return null;
    
  //   const isFull = currentParticipants >= maxParticipants;
  //   const spotsLeft = maxParticipants - currentParticipants;
  //   const percentage = (currentParticipants / maxParticipants) * 100;
    
  //   return (
  //     <div className="event-participants">
  //       <div className="participants-progress">
  //         <div 
  //           className="progress-bar" 
  //           style={{ width: `${percentage}%` }}
  //         ></div>
  //       </div>
  //       <span className="participants-count">
  //         {isFull ? 'Мест нет' : `Осталось мест: ${spotsLeft}`}
  //         {!isFull && ` (${currentParticipants}/${maxParticipants})`}
  //       </span>
  //     </div>
  //   );
  // };

  // Проверка, можно ли записаться
  // const canRegister = !isPast && currentParticipants < maxParticipants;

  return (
    
    <div 
      className={`event-card ${isPast ? 'past-event' : 'future-event'}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
      aria-label={`Подробнее о мероприятии: ${title}`}
    >
      {/* Заголовок и дата/место в правом углу */}
      <div className="event-header">
        <h3 className="event-title">{title}</h3>
        
        {/* Дата и место в правом верхнем углу */}
        <div className="event-details-header">
          <div className="event-date-header">
            <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 6v2h14V6H5z"/>
            </svg>
            <span>{formatDate(date)}</span>
          </div>
          
          <div className="event-location-header">
            <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{location}</span>
          </div>
        </div>
      </div>
      
      {/* Основное содержимое */}
      <div className="event-content">
        {/* Мета-информация */}
        
        {/* Описание */}
        <div className="event-description">
          <p>{description}</p>
        </div>
      </div>
      
      {/* Подвал карточки */}
      
    </div>
  );
};

export default EventCard;