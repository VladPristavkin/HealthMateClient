import React, { useState } from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import "./DashboardLayout.css";
import Mood from '../Mood/Mood';
import Health from '../Health/Health';
import Activity from '../Activity/Activity'
import Treatment from '../Treatment/Treatment';
import Nutrition from '../Nutrition/Nutrition'

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

type Section = 'Mood' | 'Nutrition' | 'Activity' | 'Health' | 'Treatment';

interface SectionModul {
    modul: React.ComponentType;
}

const sections: Section[] = ['Mood', 'Nutrition', 'Activity', 'Health','Treatment'];

const tempData = Array.from({ length: 30 }, (_, i) => ({
        date: `2023-07-${i + 1}`,
        kcal: Math.floor(Math.random() * 500) + 1000
      }));

      const moodData = [
        { date: '2023-05-01', mood: 4, stressLevel: 3 },
        { date: '2023-05-01', mood: 9, stressLevel: 0 },
        { date: '2023-05-01', mood: 7, stressLevel: 3 },
        { date: '2023-05-02', mood: 3, stressLevel: 5 },
        { date: '2023-05-03', mood: 2, stressLevel: 7 },
        { date: '2023-05-04', mood: 4, stressLevel: 4 },
        { date: '2023-05-05', mood: 5, stressLevel: 2 },
        { date: '2023-05-06', mood: 4, stressLevel: 3 },
        { date: '2023-05-06', mood: 6, stressLevel: 6 },
        { date: '2023-05-07', mood: 3, stressLevel: 6 },
        { date: '2023-05-08', mood: 4, stressLevel: 4 },
        { date: '2023-05-09', mood: 5, stressLevel: 1 },
        { date: '2023-05-10', mood: 4, stressLevel: 3 },
        { date: '2023-05-11', mood: 3, stressLevel: 5 },
        { date: '2023-05-12', mood: 0, stressLevel: 0 },
        { date: '2023-05-13', mood: 4, stressLevel: 4 },
        { date: '2023-05-14', mood: 5, stressLevel: 2 },
      ];

interface SectionContentProps {
  section: Section;
}

const SectionContent: React.FC<SectionContentProps> = ({ section }) => {
    if(section=='Mood'){ 
        return (
        <div style={{ textAlign: 'center' }}>
        <Mood   />
        </div>
    );}
    if(section=='Activity'){ 
        return (
        <div style={{ textAlign: 'center' }}>
        <Activity  />
        </div>
    );}
    if(section=='Nutrition'){ 
        return (
        <div style={{ textAlign: 'center' }}>
        <Nutrition/>
        </div>
    );}
    if(section=='Treatment'){ 
        return (
        <div style={{ textAlign: 'center' }}>
        <Treatment/>
        </div>
    );}

    if(section=='Health'){ 
        return (
        <div style={{ textAlign: 'center' }}>
        <Health/>
        </div>
    );}
    else{
        return null;
    }
};

const DashboardLayout: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  return (
    <Layout className="dashboard">
      <Header style={{ padding: 0 }}>
        <Menu mode="horizontal" className="dashboard-menu" selectedKeys={[sections[currentSection]]}>
          {sections.map((section) => (
            <Menu.Item className="dashboard-menu-item" key={section} onClick={() => setCurrentSection(sections.indexOf(section))}>
              {section}
            </Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content style={{ paddingLeft: "3.8em",paddingRight:"1em",paddingTop:"1em",paddingBottom:"1em", position: 'relative' }}>
        <Button 
          icon={<LeftOutlined />} 
          style={{ position: 'absolute', left: 20, top: '50%' }}
          onClick={prevSection}
        />
        <SectionContent section={sections[currentSection]} />
        <Button 
          icon={<RightOutlined />} 
          style={{ position: 'absolute', right: 20, top: '50%' }}
          onClick={nextSection}
        />
      </Content>
    </Layout>
  );
};

export default DashboardLayout;