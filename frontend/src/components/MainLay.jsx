import AddTask from "../components/AddTask";
import TaskSlot from "../components/TaskSlot";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {updatetask, deletetask, completetask} from '../redux/slice/task';
import {useUpdateTaskMutation,useDeleteTaskMutation,useEditTaskMutation} from '../redux/api/task';

const MainLayout = () => {

  const tasks = useSelector(state => state.task);
  const dispatch = useDispatch();

  useEffect(() => {
    tasks.forEach(task => {
      console.log(task);
    });
  }, [tasks]);

  const [updateTask] = useUpdateTaskMutation();
  const [DeleteTask] = useDeleteTaskMutation();
  const [EditTask] = useEditTaskMutation();

  const [taskLoading, setTaskLoading] = useState({});
  const [taskError, setTaskError] = useState([]);

 const handleUpdate = async (id) => {
    if (taskLoading[id]) return;

    setTaskLoading(l => ({ ...l,[id] : 'update' }));

    const result = await updateTask({ id }).unwrap();

    if(result){
      setTaskLoading(l => ({ ...l,[id] : '' }));
    }else{
      setTaskError(e => ([ ...e, id ]));
      setTimeout(() => {
        setTaskError(e => e.filter(t => t !== id ));
        setTaskLoading(l => ({ ...l,[id] : '' }));
      }, 3000);

      return;
    }
    dispatch(completetask({ id }));
  }

  const handleDelete = async (id) => {
    if (taskLoading[id]) return;

    setTaskLoading(l => ({ ...l,[id] : 'delete' }));

    const result = await DeleteTask({ id }).unwrap();
    
    if(result){
      dispatch(deletetask({ id }));
    }else{
      setTaskError(e => ([ ...e, id ]));
      setTimeout(() => {
        setTaskError(e => e.filter(t => t !== id ));
        setTaskLoading(l => ({ ...l,[id] : '' }));
      }, 3000);
      return;
    }
  }

  const handleEdit = async (id, description = 'test') => {
    if (taskLoading[id]) {
      setTaskLoading(l => ({ ...l,[id] : 'update' }));
      const result =  await EditTask({ id, description }).unwrap();
      if(result){
        dispatch(updatetask({ id, description }));
        setTaskLoading(l => ({ ...l,[id] : '' }));
      }else{
        setTaskError(e => ([ ...e, id ]));
        setTimeout(() => {
          setTaskError(e => e.filter(t => t !== id ));
          setTaskLoading(l => ({ ...l,[id] : '' }));
        }, 3000);
      }

      return;
    };
    setTaskLoading(l => ({ ...l,[id] : 'edit' }));
  }


  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
      <AddTask />
      <div className="
        bg-white dark:bg-gray-800
        p-4 rounded-lg shadow
      ">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Today Tasks
        </h2>

        <div className="space-y-2">
          {tasks.length > 0 ? tasks.map((t) => <TaskSlot 
              key={t.id} 
              id={t.id} 
              description={t.description} 
              completed={t.completed} 
              onToggle={handleUpdate} 
              onAction={taskLoading[t.id] ?? ''}
              onError={taskError.includes(t.id) ? true : false}
              onCurd={t.routine}
              onRemove={handleDelete} 
              onEdit={handleEdit} 
              />) : (<p className="flex justify-center text-sm text-gray-600 dark:text-gray-400">No Tasks Today</p>)}
        </div>
      </div>
    </main>
    );
};

export default MainLayout;