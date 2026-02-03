import AddTask from "../components/AddTask";
import TaskSlot from "../components/TaskSlot";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetTaskQuery, useUpdateTaskMutation, useDeleteTaskMutation, useEditTaskMutation, useAddTaskMutation } from '../redux/api/task';

const TaskPart = () => {

  const mode = useSelector(state => state.mode.mode);
  const { data: tasks = [], isLoading } = useGetTaskQuery(mode);

  const [taskLoading, setTaskLoading] = useState({});
  const [taskError, setTaskError] = useState([]);

  const [updateTask] = useUpdateTaskMutation();
  const handleUpdate = async (id) => {
    try {
      if (taskLoading[id]) return;

      setTaskLoading(l => ({ ...l, [id]: 'update' }));

      const result = await updateTask({ id }).unwrap();

      if (result) {
        setTaskLoading(l => ({ ...l, [id]: '' }));
      } else {
        setTaskError(e => ([...e, id]));
        setTimeout(() => {
          setTaskError(e => e.filter(t => t !== id));
          setTaskLoading(l => ({ ...l, [id]: '' }));
        }, 3000);

        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [DeleteTask] = useDeleteTaskMutation();
  const handleDelete = async (id) => {
    try{
      if (taskLoading[id]) return;

      setTaskLoading(l => ({ ...l, [id]: 'delete' }));

      const result = await DeleteTask({ id }).unwrap();

      if (!result) {
        setTaskError(e => ([...e, id]));
        setTimeout(() => {
          setTaskError(e => e.filter(t => t !== id));
          setTaskLoading(l => ({ ...l, [id]: '' }));
        }, 3000);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [EditTask] = useEditTaskMutation();
  const handleEdit = async (id, description = 'test') => {
    try{
      if (taskLoading[id]) {
        setTaskLoading(l => ({ ...l, [id]: 'update' }));
        const result = await EditTask({ id, description }).unwrap();
        if (result) {
          setTaskLoading(l => ({ ...l, [id]: '' }));
        } else {
          setTaskError(e => ([...e, id]));
          setTimeout(() => {
            setTaskError(e => e.filter(t => t !== id));
            setTaskLoading(l => ({ ...l, [id]: '' }));
          }, 3000);
        }

        return;
      };
      setTaskLoading(l => ({ ...l, [id]: 'edit' }));
    }catch(error){
      console.log(error);
    }
  }

  const [addTask] = useAddTaskMutation();
  const HandleAddTask = async (input) => {
    try{
      const task = { data: input};
      const result = await addTask(task);
      if (result) {
        console.log(result);
      }
    }catch(error){
      console.log(error);
    }
  }

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <AddTask UseCase={`Add ${mode.split(' ')[1]}`} HandleAddTask={HandleAddTask} mode={mode}/>
      <div className="
        bg-white dark:bg-gray-800
        p-4 rounded-lg shadow
      ">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {mode}
        </h2>

        <div className="space-y-2">
          {tasks.length > 0 ? tasks.map((t) => <TaskSlot
            key={t.id}
            id={t.id}
            description={t.description}
            completed={mode === 'Daily Routine' ? false : t.completed}
            onToggle={mode === 'Daily Routine' ? undefined : handleUpdate}
            onAction={taskLoading[t.id] ?? ''}
            onError={taskError.includes(t.id) ? true : false}
            onCurd={t.routine}
            onRemove={handleDelete}
            onEdit={handleEdit}
            link={t.link == null ? false : true}
            Routine={mode === 'Daily Routine' ? true : false}
          />) : (<p className="flex justify-center text-sm text-gray-600 dark:text-gray-400">No {mode}</p>)}
        </div>
      </div>
    </main>
  );
};

export default TaskPart;