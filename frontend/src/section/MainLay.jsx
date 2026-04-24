import AddTask from "../components/AddTask";
import TaskSlot from "../components/TaskSlot";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MainSkeleton from "../components/Loader/MainSkeleton";
import Popup from "../components/popup";
import noTask from "../assets/no task.png"
import { useGetTaskQuery, useUpdateTaskMutation, useDeleteTaskMutation, useEditTaskMutation, useAddTaskMutation, useGoalTaskMutation } from '../redux/api/task';

const TaskPart = () => {

  const mode = useSelector(state => state.mode.mode);
  const { data: tasks = [], isLoading: queryLoading } = useGetTaskQuery(mode);

  const [taskLoading, setTaskLoading] = useState({});
  const [taskError, setTaskError] = useState([]);
  const [popup, setpopup] = useState(null);

  const [GoalTask] = useGoalTaskMutation();

  useEffect(() => {
    const fetchGoalTask = async () => {
      try {
        await GoalTask();
      } catch (err) {
        console.error(err);
      }
    };

    fetchGoalTask();
  }, []);

  const [updateTask] = useUpdateTaskMutation();
  const handleUpdate = async (id) => {
    try {
      if (taskLoading[id]) return;

      setTaskLoading(l => ({ ...l, [id]: 'update' }));

      const result = await updateTask({ id, type: mode }).unwrap();

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

      const result = await DeleteTask({ id, type: mode }).unwrap();

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
        const result = await EditTask({ id, description, type: mode }).unwrap();
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

  const [addTask, { isLoading: addTaskLoading }] = useAddTaskMutation();
  const [addTaskError, setAddTaskError] = useState(null);
const HandleAddTask = async (input, Ai = false) => {
  if (Ai) {
    const results = await Promise.allSettled(
      input.map((item) => {
        const [description, link] = item.split(" - ");
        return addTask({ description, mode: "Daily Routine", link });
      })
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length) {
      setAddTaskError(`${failed.length} task(s) failed to add.`);
    }

    setpopup(null);
    await GoalTask();
    return;
  }

  try {
    const result = await addTask({
      description: input.description,
      mode: input.mode,
      link: input.link,
    });

    if (result?.error) {
      setAddTaskError(result.error.data?.message ?? "Something went wrong.");
      return;
    }

    await GoalTask();

    if (result.data.aiError) {
      setAddTaskError(result.data.aiError);
      return;
    }

    if (result.data.aiGenerated?.length) {
      const goalId = result.data.goalId;
      setpopup(
        <section className="space-y-2.5">
          {result.data.aiGenerated.map((t) => (
            <label key={t} className="flex gap-3 justify-start items-center cursor-pointer">
              <input
                type="checkbox"
                name="description"
                value={`${t} - ${goalId}`}
                className="peer hidden"
              />
              <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-200" />
              <p>{t}</p>
            </label>
          ))}
        </section>
      );
    }

  } catch (error) {
    console.error("[HandleAddTask]", error);
    setAddTaskError(error?.data?.message ?? "Something went wrong. Please try again.");
  }
};

  return (
    <>
    {popup && <Popup children={popup} cleaner={setpopup} update={HandleAddTask} header={'Routine Suggestion'}/>}
    {
      queryLoading ? <MainSkeleton /> : (<main className="flex-1 p-4 sm:p-6 overflow-y-auto hide-scrollbar bg-white dark:bg-black">
      <AddTask UseCase={`Add ${mode.split(' ')[1]}`} HandleAddTask={HandleAddTask} mode={mode} isError={addTaskError} error={addTaskError} isLoading={addTaskLoading} />
      <div className="
        bg-gray-100 dark:bg-gray-800
        p-4 rounded-lg shadow
      ">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
          {mode}
        </h2>

        <div className="space-y-2.5">
          {tasks.length > 0 ? tasks.map((t) => <TaskSlot
            key={t._id}
            id={t._id}
            description={t.description}
            completed={mode === 'Daily Routine' ? false : t.completed}
            onToggle={mode === 'Daily Routine' ? undefined : handleUpdate}
            onAction={taskLoading[t._id] ?? ''}
            onError={taskError.includes(t._id) ? true : false}
            onCurd={mode == 'Today Task' ? t.routine : false}
            onRemove={handleDelete}
            onEdit={handleEdit}
            yearly={mode !== 'Yearly Goal' ? t.yearly : false}
            Routine={mode === 'Daily Routine' ? true : false}
            mode={mode}
          />) : (
          <div className="flex flex-col justify-center text-sm text-gray-600 dark:text-gray-400">
            <img
              src={noTask}
              className="h-100 object-contain rounded-[3px]"
            />
            <div className="flex flex-col items-center mt-[-50px] mb-4">
              <p className="text-md font-semibold">🎉 No {mode}</p>
              <p className="text-sm">Create a new task to get started</p>
            </div>
            </div>)
          }
        </div>
      </div>
    </main>)
    }
    </>
  );
};

export default TaskPart;