import Header from "../components/Header";
import Footer from "../components/footer";
import LeftSidebar from "../components/LeftBar";
import RightSidebar from "../components/RightBar";
import MainLayout from "../components/MainLay";
import { useState } from "react";


const Home = () => {

  const [appstatus, setAppStatus] = useState("laptop");

  const renderLayout = () => {
    switch (appstatus) {
      case "history":
        return <LeftSidebar />;

      case "routine":
        return <RightSidebar />;

      case "today":
        return <MainLayout />;

      case "laptop":
        return (
        <>
        <div className="hidden lg:flex">
            <LeftSidebar />
        </div>

        <MainLayout />
        
        <div className="hidden lg:flex">
            <RightSidebar />
        </div>
      </>);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {renderLayout()}
      </div>

      <Footer activeTab={appstatus} setActiveTab={setAppStatus} />
    </div>
  );
};

export default Home;
