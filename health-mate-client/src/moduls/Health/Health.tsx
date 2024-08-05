import React, { useState, useEffect } from 'react';
import HealthCard from "./components/HealthCard/HealthCard";
import './Health.css';
import UniversalChart, { DataPoint } from "../../components/UniversalChart/UniversalChart";
import { ChartTypes } from "../../components/UniversalChart/UniversalChart";
import HealthRecords from './components/HealthRecords/HealthRecords';
import { Button, DatePicker, Form, InputNumber, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { del, get, post, put } from '../../api/genericApi';
import { HealthData } from '../../shared/types/Health';

const Health: React.FC = () => {
    const [healthData, setHealthData] = useState<HealthData[]>([]);
    const [chartData, setChartData] = useState<DataPoint[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const userId = "21cd0029-4e1b-4db1-bd13-737e4cc05b1b";

    useEffect(() => {
        fetchHealthRecords();
    }, []);

    const fetchHealthRecords = async () => {
        try {
            const today = moment().format('YYYY-MM-DD');
            const oneMonthAgo = moment().subtract(1, 'month').format('YYYY-MM-DD');
            const response = await get<HealthData[]>(`/Health/${userId}/by-date`, {
                params: {
                    date: today,
                }
            });
            if (response.status === 'success') {
                const records = response.data;
                setHealthData(records);
                setChartData(convertToChartData(records));
            } else {
                message.error('Failed to fetch health records');
            }
        } catch (error) {
            message.error('Failed to fetch health records');
        }
    };

    const convertToChartData = (data: HealthData[]): DataPoint[] => {
        return data.map(item => ({
            date: item.date,
            systolicBloodPressure: item.systolicBloodPressure,
            diastolicBloodPressure: item.diastolicBloodPressure,
            heartRate: item.heartRate,
            bloodSugar: item.bloodSugar,
            cholesterol: item.cholesterol
        }));
    };

    const healthCards = [
        { image: "/images/heart-rate.png", title: "Heart Rate", getValue: (data: HealthData) => data.heartRate.toString(), unitOfMeasure: "bpm" },
        { image: "/images/blood-pressure.png", title: "Blood Pressure", getValue: (data: HealthData) => `${data.systolicBloodPressure}/${data.diastolicBloodPressure}`, unitOfMeasure: "mmHg" },
        { image: "/images/blood-sugar.png", title: "Blood Sugar", getValue: (data: HealthData) => data.bloodSugar.toFixed(1), unitOfMeasure: "mmol/L" },
        { image: "/images/cholesterol.png", title: "Cholesterol", getValue: (data: HealthData) => data.cholesterol.toFixed(1), unitOfMeasure: "mmol/L" }
    ];

    const periodChoices = [
        { value: 'week', label: 'Week', days: 7 },
        { value: 'Two weeks', label: 'Two weeks', days: 14 },
        { value: 'month', label: 'Month', days: 30 },
    ];

    const fetchData = async (period: string): Promise<DataPoint[]> => {
        const days = periodChoices.find(p => p.value === period)?.days || 7;
        const finishDate = moment().format('YYYY-MM-DD');
        const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
        try {

            const response = await get<HealthData[]>(`/Health/${userId}/between-dates`, {
                params: {
                    startDate,
                    finishDate,
                },
            });

            if (response.status === 'success') {
                return convertToChartData(response.data);
            } else {
                message.error('Failed to fetch health data');
                return [];
            }

        } catch (error) {
            message.error('Failed to fetch health data');
            return [];
        }
    };

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            const health: Omit<HealthData, 'id'> = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
                userId: userId,
                notes: []
            };

            const response = await post<Omit<HealthData, 'id'>, HealthData>('/Health', health);

            if (response.status === 'success') {
                const addedRecord = response.data;
                setHealthData([...healthData, addedRecord]);
                setIsModalVisible(false);
                message.success('Health record added successfully');
            } else {
                message.error('Failed to add health record');
            }

        } catch (error) {
            message.error('Failed to add health record');
        }
    };

    const handleUpdate = async (updatedRecord: HealthData) => {
        try {
            updatedRecord.userId=userId;
            const response = await put<HealthData, void>(`/Health/${updatedRecord.id}`, updatedRecord);

            if (response.status === 'success') {
                setHealthData(healthData.map(record =>
                    record.id === updatedRecord.id ? updatedRecord : record
                ));
                message.success('Health record updated successfully');
            } else {
                message.error('Failed to update health record');
            }
        } catch (error) {
            message.error('Failed to update health record');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await del<void>(`/Health/${id}`);

            if (response.status === 'success') {
                setHealthData(healthData.filter(record => record.id !== id));
                message.success('Health record deleted successfully');
            } else {
                message.error('Failed to delete health record');
            }
        } catch (error) {
            message.error('Failed to delete health record');
        }
    };

    return (
        <div className="health">
            <h2>Health indicators</h2>
            <div className="health-indicators">
                {healthCards.map((card, index) => (
                    <HealthCard
                        key={index}
                        image={card.image}
                        title={card.title}
                        value={healthData.length > 0 ? card.getValue(healthData[healthData.length - 1]) : ''}
                        unitOfMeasure={card.unitOfMeasure}
                    />
                ))}
            </div>
            <div className="health-chart-and-records">
                <div className="health-chart">
                    <UniversalChart
                        data={chartData}
                        title="Health"
                        chartType={ChartTypes.LINE}
                        dataKeys={['systolicBloodPressure', 'diastolicBloodPressure', 'heartRate', 'bloodSugar', 'cholesterol']}
                        periodChoices={periodChoices}
                        defaultPeriod="week"
                        colors={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE']}
                        fetchData={fetchData}
                        language="en"
                        startDate="2024-07-01"
                    />
                </div>
                <div className="health-records-container">
                    <Button icon={<PlusOutlined />} onClick={showModal} style={{ marginBottom: 16, fontSize: 16, borderRadius: 48 }}>
                        Add New Health Record
                    </Button>
                    <div className="health-records">
                        {healthData.map((record) => (
                            <HealthRecords
                                key={record.id}
                                healthRecord={record}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                    <Modal style={{ top: "25%" }}
                        title="Add New Health Record"
                        open={isModalVisible}
                        onOk={handleAdd}
                        onCancel={() => setIsModalVisible(false)}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                                <DatePicker />
                            </Form.Item>
                            <Form.Item name="systolicBloodPressure" label="Systolic Blood Pressure" rules={[{ required: true }]}>
                                <InputNumber />
                            </Form.Item>
                            <Form.Item name="diastolicBloodPressure" label="Diastolic Blood Pressure" rules={[{ required: true }]}>
                                <InputNumber />
                            </Form.Item>
                            <Form.Item name="heartRate" label="Heart Rate" rules={[{ required: true }]}>
                                <InputNumber />
                            </Form.Item>
                            <Form.Item name="bloodSugar" label="Blood Sugar" rules={[{ required: true }]}>
                                <InputNumber step={0.1} precision={1} />
                            </Form.Item>
                            <Form.Item name="cholesterol" label="Cholesterol" rules={[{ required: true }]}>
                                <InputNumber step={0.1} precision={1} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Health;
