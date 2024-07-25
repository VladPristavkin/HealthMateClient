import React, { useState } from "react";
import { HealthData } from "../../interfaces/HealthData";
import { Card, Statistic, Row, Col, Button, Modal, Form, Input, InputNumber, DatePicker, Typography, Popconfirm, List } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { NoteData } from "../../interfaces/NoteData";
import moment from "moment";

interface HealthRecordsProps {
    onUpdate: (updatedRecord: HealthData) => void;
    onDelete: (id: string) => void;
    healthRecord: HealthData;
}

const { TextArea } = Input;
const { Text } = Typography;

const HealthRecords: React.FC<HealthRecordsProps> = ({ healthRecord, onUpdate, onDelete }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [editingNote, setEditingNote] = useState<NoteData | null>(null);
    const [form] = Form.useForm();
    const [noteForm] = Form.useForm();

    const showModal = () => {
        form.setFieldsValue({
            ...healthRecord,
            date: healthRecord.date ? moment(healthRecord.date) : undefined,
        });
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const updatedRecord: HealthData = {
                ...healthRecord,
                ...values,
                date: values.date.toISOString().split('T')[0],
            };
            onUpdate(updatedRecord);
            setIsModalVisible(false);
        });
    };

    const showNoteModal = (note?: NoteData) => {
        if (note) {
            setEditingNote(note);
            noteForm.setFieldsValue(note);
        } else {
            setEditingNote(null);
            noteForm.resetFields();
        }
        setIsNoteModalVisible(true);
    };

    const handleNoteOk = () => {
        noteForm.validateFields().then((values) => {
            const newNote: NoteData = {
                id: editingNote ? editingNote.id : `note-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                content: values.content,
            };

            const updatedNotes = editingNote
                ? healthRecord.notes.map(n => n.id === editingNote.id ? newNote : n)
                : [...healthRecord.notes, newNote];

            const updatedRecord: HealthData = {
                ...healthRecord,
                notes: updatedNotes,
            };

            onUpdate(updatedRecord);
            setIsNoteModalVisible(false);
        });
    };

    const handleDeleteNote = (noteId: string) => {
        const updatedNotes = healthRecord.notes.filter(n => n.id !== noteId);
        const updatedRecord: HealthData = {
            ...healthRecord,
            notes: updatedNotes,
        };
        onUpdate(updatedRecord);
    };
    return (
        <Card style={{ borderRadius: 48 }}
            title={`Health Record: ${healthRecord.date}`}
            extra={
                <>
                    <Button icon={<EditOutlined />} onClick={showModal} style={{ marginRight: 8 }} />
                    <Popconfirm
                        title="Are you sure you want to delete this health record?"
                        onConfirm={() => onDelete(healthRecord.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </>
            }
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic title="Blood Pressure" value={`${healthRecord.systolicBloodPressure}/${healthRecord.diastolicBloodPressure}`} suffix="mmHg" />
                </Col>
                <Col span={12}>
                    <Statistic title="Heart Rate" value={healthRecord.heartRate} suffix="bpm" />
                </Col>
                <Col span={12}>
                    <Statistic title="Blood Sugar" value={healthRecord.bloodSugar} suffix="mmol/L" precision={1} />
                </Col>
                <Col span={12}>
                    <Statistic title="Cholesterol" value={healthRecord.cholesterol} suffix="mmol/L" precision={1} />
                </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
                <Text strong>Notes:</Text>
                <Button icon={<PlusOutlined />} onClick={() => showNoteModal()} style={{ marginLeft: 8 }}>
                    Add Note
                </Button>
                <List
                    dataSource={healthRecord.notes}
                    renderItem={note => (
                        <List.Item
                            actions={[
                                <Button icon={<EditOutlined />} onClick={() => showNoteModal(note)} />,
                                <Popconfirm
                                    title="Are you sure you want to delete this note?"
                                    onConfirm={() => handleDeleteNote(note.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button icon={<DeleteOutlined />} danger />
                                </Popconfirm>
                            ]}
                        >
                            <List.Item.Meta
                                title={note.date}
                                description={note.content}
                            />
                        </List.Item>
                    )}
                />
            </div>

            <Modal
                title="Edit Health Record"
                open={isModalVisible}
                onOk={handleOk}
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

            <Modal
                title={editingNote ? "Edit Note" : "Add Note"}
                open={isNoteModalVisible}
                onOk={handleNoteOk}
                onCancel={() => setIsNoteModalVisible(false)}
            >
                <Form form={noteForm} layout="vertical">
                    <Form.Item name="content" label="Note Content" rules={[{ required: true }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default HealthRecords;
