import React, { useState } from 'react';
import { Calendar, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);

interface HeaderRenderProps {
  value: Dayjs;
  type: 'month' | 'year';
  onChange: (date: Dayjs) => void;
  onTypeChange: (type: 'month' | 'year') => void;
}

const CustomCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());

  const handlePrevMonth = (): void => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = (): void => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const headerRender = ({ value }: HeaderRenderProps): React.ReactNode => {
    const current = value;
    const monthName = current.format('MMMM');

    return (
      <div style={{ padding: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button icon={<LeftOutlined />} onClick={handlePrevMonth} />
        <div>{monthName} {current.year()}</div>
        <Button icon={<RightOutlined />} onClick={handleNextMonth} />
      </div>
    );
  };

  return (
    <Calendar 
      fullscreen={false}
      headerRender={headerRender}
      value={currentDate}
      onSelect={(newDate: Dayjs) => setCurrentDate(newDate)}
      style={{ width: '25em', height:'25em' }}
    />
  );
};

export default CustomCalendar;
