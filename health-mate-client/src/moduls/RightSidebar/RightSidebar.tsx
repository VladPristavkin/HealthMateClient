import React from "react";
import { Layout } from 'antd';
import "./RightSidebar.css";
import MainPageRecomendations from "./components/MainPageRecomendations/MainPageRecomendations";
import CustomCalendar from "./components/CustomCalendar/CustomCalendar";

const { Sider } = Layout;

const RightSidebar: React.FC = ()=>{
    return(
        <Sider className="right-sidebar" width={400}>
            <div className="right-sidebar-calendar">
                <CustomCalendar/>
            </div>
            <div className="right-sidebar-recomendations">
                <MainPageRecomendations/>
            </div>
        </Sider>
    );
}

export default RightSidebar;