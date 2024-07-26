import React from "react";
import Header from "../../moduls/Header/Header";
import './MainPage.css';
import RightSidebar from "../../moduls/RightSidebar/RightSidebar";
import DashboardLayout from "../../moduls/DashboardLayout/DashboardLayout";

const MainPage: React.FC = () => {

    return (
        <div className="main-page">
            <div className="main-content">
                <Header />
                <div className="main-content-body">
                    <div className="main-content-body-left">
                        <DashboardLayout />
                    </div>
                    <div className="main-content-body-right">
                        <RightSidebar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;