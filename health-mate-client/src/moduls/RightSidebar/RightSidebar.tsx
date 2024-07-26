import React from "react";
import { Layout } from 'antd';
import CustomCalendar from "./components/CustomCalendar/CustomCalendar";

const RightSidebar: React.FC = () => {
    return (
        <Layout.Sider width={400}
            style={{
                backgroundColor: "#ffffff",
                flexDirection: "column",
                display: "flex",
                boxShadow: " 0.2em 0 1em rgba(0, 0, 0, 0.1)",
                borderRadius: "3em",
                overflow: "hidden",
                alignItems: "center"
            }}
        >
            <div>
                <CustomCalendar />
            </div>
        </Layout.Sider>
    );
}

export default RightSidebar;