import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
    name: "task",
    initialState: [],
    reducers: {
        addtask: (state, action) => {
            state.push(action.payload);
        },
        updatetask: (state, action) => {
            const { id, description } = action.payload;
            const task = state.find((t) => t.id === id);
            if (task) task.description = description;
        },
        deletetask: (state, action) => {
            const { id } = action.payload;
            return state.filter((t) => t.id !== id);
        },
        completetask: (state, action) => {
            const { id } = action.payload;
            const task = state.find((t) => t.id === id);
            if (task) task.completed = !task.completed;
        },
        toggleRoutine: (state, action) => {
            const { id } = action.payload;
            const task = state.find((t) => t.id === id);
            if (task) task.routine = !task.routine;
        },
    }
});

export const { addtask, updatetask, deletetask, completetask, toggleRoutine } = taskSlice.actions;
export default taskSlice.reducer;