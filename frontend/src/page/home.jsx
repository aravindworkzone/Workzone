import Header from "../components/Header";
import Footer from "../components/Footer";
import LeftSidebar from "../section/LeftBar";
import RightSidebar from "../section/RightBar";
import MainLayout from "../section/MainLay";
import { useSelector, useDispatch } from "react-redux";
import { setDeviceType } from "../redux/slice/deviceType";
import { useEffect } from "react";

const Home = () => {

  const appstatus = useSelector((state) => state.deviceType.deviceType);

  const dispatch = useDispatch();

  const handleToogle = (value) => {
    dispatch(setDeviceType(value))
  }

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    dispatch(setDeviceType(isMobile ? "Mobile" : "Desktop"));
  }, [dispatch]);


  const renderLayout = () => {
    if (appstatus === "history") return <LeftSidebar />;
    if (appstatus === "routine") return <RightSidebar />;
    if (appstatus === "today") return <MainLayout />;

    return (
      <>
        <div className="hidden lg:flex">
          <LeftSidebar />
        </div>

        <MainLayout />

        <div className="hidden lg:flex">
          <RightSidebar />
        </div>
      </>
    );
  };


  return (
    <>
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
      <Header />

      <div className="flex flex-1 overflow-hidden mb-12 lg:mb-0">
        {renderLayout()}
      </div>

      <Footer appstatus={appstatus} OnToggle={handleToogle} />
    </div>
    </>
  );
};

export default Home;
