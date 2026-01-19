import AddTask from "../components/AddTask";
import TodayTasks from "../components/TodayTask";

const MainLayout = () => {
  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <AddTask />
        <TodayTasks />
    </main>
    );
};

export default MainLayout;