import { FC, useState } from "react";
import { Card, Statistic, Row, Col, Button, Modal, Form, Input, InputNumber, DatePicker, Typography, Popconfirm, List } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from "moment";
import { NoteType } from "../../../../shared/types/NoteType";
import { HealthType } from "../../../../shared/types/HealthType";

interface HealthRecordsProps {
    onUpdate: (updatedRecord: HealthType) => void;
    onDelete: (id: string) => void;
    healthRecord: HealthType;
}

const HealthRecords: FC<HealthRecordsProps> = (healthRecordsProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [editingNote, setEditingNote] = useState<NoteType | null>(null);
    const [form] = Form.useForm();
    const [noteForm] = Form.useForm();

    const showModal = () => {
        form.setFieldsValue({
            ...healthRecordsProps.healthRecord,
            date: healthRecordsProps.healthRecord.date ? moment(healthRecordsProps.healthRecord.date) : undefined,
        });
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const updatedRecord: HealthType = {
                ...healthRecordsProps.healthRecord,
                ...values,
                date: values.date.toISOString().split('T')[0],
            };
            healthRecordsProps.onUpdate(updatedRecord);
            setIsModalVisible(false);
        });
    };

    const showNoteModal = (note?: NoteType) => {
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
            const newNote: NoteType = {
                id: editingNote ? editingNote.id : `note-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                content: values.content,
            };

            const updatedNotes = editingNote
                ? healthRecordsProps.healthRecord.notes.map(n => n.id === editingNote.id ? newNote : n)
                : [...healthRecordsProps.healthRecord.notes, newNote];

            const updatedRecord: HealthType = {
                ...healthRecordsProps.healthRecord,
                notes: updatedNotes,
            };

            healthRecordsProps.onUpdate(updatedRecord);
            setIsNoteModalVisible(false);
        });
    };

    const handleDeleteNote = (noteId: string) => {
        const updatedNotes = healthRecordsProps.healthRecord.notes.filter(n => n.id !== noteId);
        const updatedRecord: HealthType = {
            ...healthRecordsProps.healthRecord,
            notes: updatedNotes,
        };
        healthRecordsProps.onUpdate(updatedRecord);
    };
    
    return (
        <Card style={{ borderRadius: 48 }}
            title={`Health Record: ${healthRecordsProps.healthRecord.date}`}
            extra={
                <>
                    <Button icon={<EditOutlined />} onClick={showModal} style={{ marginRight: 8 }} />
                    <Popconfirm
                        title="Are you sure you want to delete this health record?"
                        onConfirm={() => healthRecordsProps.onDelete(healthRecordsProps.healthRecord.id)}
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
                    <Statistic title="Blood Pressure" value={`${healthRecordsProps.healthRecord.systolicBloodPressure}/${healthRecordsProps.healthRecord.diastolicBloodPressure}`} suffix="mmHg" />
                </Col>
                <Col span={12}>
                    <Statistic title="Heart Rate" value={healthRecordsProps.healthRecord.heartRate} suffix="bpm" />
                </Col>
                <Col span={12}>
                    <Statistic title="Blood Sugar" value={healthRecordsProps.healthRecord.bloodSugar} suffix="mmol/L" precision={1} />
                </Col>
                <Col span={12}>
                    <Statistic title="Cholesterol" value={healthRecordsProps.healthRecord.cholesterol} suffix="mmol/L" precision={1} />
                </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
                <Typography.Text strong>Notes:</Typography.Text>
                <Button icon={<PlusOutlined />} onClick={() => showNoteModal()} style={{ marginLeft: 8 }}>
                    Add Note
                </Button>
                <List
                    dataSource={healthRecordsProps.healthRecord.notes}
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
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default HealthRecords;
