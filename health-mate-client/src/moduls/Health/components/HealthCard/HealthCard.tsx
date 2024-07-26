import { FC } from 'react';
import { Card, Avatar, Typography } from 'antd';

interface HealthCardProps {
    image: string;
    title: string;
    value: string;
    unitOfMeasure: string;
}

const HealthCard: FC<HealthCardProps> = (HealthCardProps) => {
    return (
        <Card
            style={{
                margin: '0.5rem',
                borderRadius: '1rem',
                transition: 'transform 0.3s ease',
            }}
            bodyStyle={{
                padding: '0.8em',
                display: 'flex',
                alignItems: 'center',
            }}
            hoverable
        >
            <Avatar
                size={64}
                src={HealthCardProps.image}
                style={{
                    marginRight: '1em',

                }}
            />
            <div>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    {HealthCardProps.value} <Typography.Text type="secondary" style={{ fontSize: '1rem', color: "#000000" }}>{HealthCardProps.unitOfMeasure}</Typography.Text>
                </Typography.Title>
                <Typography.Text type="secondary" style={{ color: "#000000" }}>{HealthCardProps.title}</Typography.Text>
            </div>
        </Card>
    );
};

export default HealthCard;