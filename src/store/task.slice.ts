import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { GetTaskResponse } from '../interfaces/task.interface';
import { PREFIX } from '../helpers/API';
import { RootState } from './store';

export interface TaskModel {
    title: string;
    description: string;
    deadline: Date
}

export interface TaskState {
    tasks?: GetTaskResponse[] | null;
}

const initialState: TaskState = {
	tasks: null
};

export const getTasks = createAsyncThunk<GetTaskResponse[], void, {state: RootState}>('task/get',
	async (_, thunkApi) => {
		const token = thunkApi.getState().user.jwt;

		const {data} = await axios.get<GetTaskResponse[]>(`${PREFIX}/task/get`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return data;
	}
);

export const taskSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
        
	},
	extraReducers: (builder) => {
		builder.addCase(getTasks.fulfilled, (state, action) => {
			state.tasks = action.payload;
		});
	}
});


export default taskSlice.reducer;
export const taskActions = taskSlice.actions;