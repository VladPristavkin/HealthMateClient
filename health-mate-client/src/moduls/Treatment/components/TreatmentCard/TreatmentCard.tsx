import React from 'react';
import './TreatmentCard.css';

interface TreatmentCardProps {
    icon: string;
    value: string;
    unit: string;
    title: string;
  }
  
  const TreatmentCard: React.FC<TreatmentCardProps> = ({ icon, value, unit, title }) => {
    return (
      <div className="treatment-card">
        <div className="treatment-card-icon">
          <img src={icon} alt={title} />
        </div>
        <div className="treatment-card-content">
          <div className="treatment-card-value-container">
            <span className="treatment-card-value">{value}</span>
            <span className="treatment-card-unit">{unit}</span>
          </div>
          <div className="treatment-card-title">{title}</div>
        </div>
      </div>
    );
  }
  
  export default TreatmentCard;