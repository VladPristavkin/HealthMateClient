import React, { useState, useEffect, useRef } from 'react';
import { Card, Select, Typography, Row, Col } from 'antd';
import { LineChart, Line, BarChart, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import "./UniversalChart.css";

const { Title } = Typography;
const { Option } = Select;

export enum ChartTypes {
  LINE = 'line',
  BAR='bar',
}

export interface DataPoint {
  [date: string]: string | number;
}

interface PeriodOption {
  value: string;
  label: string;
  days: number;
}

interface UniversalChartProps {
  data: DataPoint[];
  title: string;
  chartType?: ChartTypes;
  dataKeys?: string[];
  defaultPeriod?: string;
  colors: string[];
  language?: string;
  startDate?: string;
  periodChoices: PeriodOption[];
  fetchData?: (period: string, startDate: string) => Promise<DataPoint[]>;
}

interface Localization {
  [key: string]: {
    [key: string]: string;
  };
}

const localization: Localization = {
  en: {
    selectPeriod: "Select period",
    startDate: "Start Date",
  },
  ru: {
    selectPeriod: "Выберите период",
    startDate: "Дата начала",
  },
};

const UniversalChart: React.FC<UniversalChartProps> = ({
  data,
  title,
  chartType = ChartTypes.LINE,
  dataKeys,
  periodChoices,
  defaultPeriod,
  colors,
  fetchData,
  language = 'en',
  startDate: initialStartDate,
}) => {
  const [visibleItems, setVisibleItems] = useState<number>(14);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [period, setPeriod] = useState<string>(defaultPeriod || '');
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption | undefined>(periodChoices.find(p => p.value === defaultPeriod));
  const [startDate, setStartDate] = useState<string>(initialStartDate || dayjs().startOf('week').format('YYYY-MM-DD'));
  const [allDates, setAllDates] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      let newData: DataPoint[];
      if (fetchData) {
        try {
          newData = await fetchData(period, startDate);
          console.log('Fetched data:', newData);
        } catch (error) {
          console.error('Error fetching data:', error);
          newData = [];
        }
      } else {
        newData = data;
      }

      const start = dayjs(startDate);
      const days = calculateDays(period, startDate);
      const end = selectedPeriod ? start.add(days, 'day') : dayjs(newData[newData.length - 1].date);
      const dates = [];
      for (let d = start; d.isBefore(end); d = d.add(1, 'day')) {
        dates.push(d.format('YYYY-MM-DD'));
      }
      setAllDates(dates);

      const filledData = dates.map(date => {
        const point = newData.find(d => d.date === date);
        return point || { date, ...dataKeys?.reduce((acc, key) => ({ ...acc, [key]: null }), {}) };
      });

      setChartData(filledData);
      setStartIndex(0);
    };

    loadData();
  }, [period, startDate, fetchData, data, selectedPeriod]);

  const calculateDays = (period: string, startDate: string): number => {
    const start = dayjs(startDate);

    switch (period.toLowerCase()) {
      case 'week':
        return 7;
      case 'month':
        return start.add(1, 'month').diff(start, 'day');
      case 'year':
        return start.add(1, 'year').diff(start, 'day');
      default:
        return selectedPeriod ? selectedPeriod?.days : 30;
    }
  };

  const visibleData = allDates.slice(startIndex, startIndex + visibleItems).map(date =>
    chartData.find(d => d.date === date) || { date, ...dataKeys?.reduce((acc, key) => ({ ...acc, [key]: null }), {}) }
  );

  const handlePrev = () => {
    setStartIndex(Math.max(0, startIndex - visibleItems));
  };

  const handleNext = () => {
    setStartIndex(Math.min(chartData.length - visibleItems, startIndex + visibleItems));
  };

  const formatXAxis = (value: string | number): string => {
    const date = new Date(value);
    return date.toLocaleDateString(language, { day: 'numeric', month: 'short' });
  };

  const handlePeriodChange = (value: string) => {
    const selected = periodChoices?.find(p => p.value === value);
    setSelectedPeriod(selected);
    setPeriod(value);
  };

  const renderChart = () => {
    if (chartType === ChartTypes.BAR) {
      return (
        <BarChart data={visibleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={'date'} tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip
            labelFormatter={(label: string | number) => {
              if (typeof label === 'string' && label.includes('-')) {
                return new Date(label).toLocaleDateString(language, { day: 'numeric', month: 'short' });
              }
              return label;
            }}
          />
          <Legend />
          {dataKeys?.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={colors[index % colors.length]} 
              name={key} 
              isAnimationActive={true} 
              animationBegin={0} 
              animationDuration={1500} 
            >
              {visibleData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry[key] === null ? 'transparent' : colors[index % colors.length]} 
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      );
    } else {
      return (
        <LineChart data={visibleData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={'date'} tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip
            labelFormatter={(label: string | number) => {
              if (typeof label === 'string' && label.includes('-')) {
                return new Date(label).toLocaleDateString(language, { day: 'numeric', month: 'short' });
              }
              return label;
            }}
          />
          <Legend />
          {dataKeys?.map((key, index) => (
            <Line 
              key={key} 
              type="monotone" 
              dataKey={key} 
              stroke={colors[index % colors.length]} 
              name={key} 
              isAnimationActive={true} 
              animationBegin={0} 
              animationDuration={1500} 
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      );
    }
  };

  return (
    <Card className="universal-chart">
      <Row justify="space-between" align="middle" className="chart-header">
        <Col>
          <Title level={4}>{title}</Title>
        </Col>
        <Col>
          {periodChoices && (
            <Select value={selectedPeriod?.value} onChange={handlePeriodChange} className="period-select" placeholder={localization[language].selectPeriod}>
              {periodChoices.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          )}
        </Col>
      </Row>
      <div className="chart-container" ref={chartRef}>
        <ResponsiveContainer width="100%" height={400} >
          {renderChart()}
        </ResponsiveContainer>
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="nav-button nav-button-left"
        >
          <LeftOutlined />
        </button>
        <button
          onClick={handleNext}
          disabled={startIndex + visibleItems >= chartData.length}
          className="nav-button nav-button-right"
        >
          <RightOutlined />
        </button>
      </div>
    </Card>
  );
};

export default UniversalChart;
