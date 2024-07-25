import React from "react";
import './HealthCard.css';

interface HealthCardProps {
    image: string;
    title: string;
    value: string;
    unitOfMeasure: string;
}

const HealthCard: React.FC<HealthCardProps> = ({image, title, value, unitOfMeasure}) => {
    return (
        <div className="health-card">
            <div className="health-card-img">
                <img src={image} alt={title} />
            </div>
            <div className="health-card-data">
                <h3>{value} <span>{unitOfMeasure}</span></h3>
                <p>{title}</p>
            </div>
        </div>
    );
}

export default HealthCard;