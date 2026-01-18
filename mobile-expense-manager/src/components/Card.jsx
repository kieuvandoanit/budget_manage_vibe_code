const Card = ({ children, className = '', onClick }) => {
  const clickableClass = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : '';
  
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-4 ${clickableClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
