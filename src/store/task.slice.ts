import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { GetTaskResponse } from '../interfaces/task.interface';
import { PREFIX } from '../helpers/API';
import { RootState } from './store';

const getRequestConfig = (token: string | null): AxiosRequestConfig => ({
	headers: {
		Authorization: `Bearer ${token}`
	}
});

export interface TaskModel {
  title: string;
  description: string;
  deadline: Date;
}

export interface TaskState {
  tasks: GetTaskResponse[] | null;
  deleteStatus: 'idle' | 'pending' | 'success' | 'error';
  deleteErrorMessage?: string;
}

const initialState: TaskState = {
	tasks: null,
	deleteStatus: 'idle'
};

export const deleteTask = createAsyncThunk<
  string | boolean,
  string,
  { state: RootState }
>('task/delete', async (taskId, thunkApi) => {
	try {
		const token = thunkApi.getState().user.jwt;

		const { data } = await axios.delete(
			`${PREFIX}/task/delete/${taskId}`,
			getRequestConfig(token)
		);
		console.log(data);
		return taskId;
	} catch (e) {
		console.log(e);
		return false;
	}
});

export const getTasks = createAsyncThunk<
  GetTaskResponse[],
  void,
  { state: RootState }
>('task/get', async (_, thunkApi) => {
	const token = thunkApi.getState().user.jwt;

	const { data } = await axios.get<GetTaskResponse[]>(
		`${PREFIX}/task/get`,
		getRequestConfig(token)
	);
	return data;
});

export const taskSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
		clearDeleteError: (state) => {
			state.deleteErrorMessage = undefined;
		},
		clearDeleteStatus: (state) => {
			state.deleteStatus = 'idle';
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getTasks.fulfilled, (state, action) => {
			state.tasks = action.payload;
		});

		builder.addCase(deleteTask.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.deleteStatus = 'success';
			state.tasks = state.tasks!.filter((task) => task._id !== action.payload);
		});
		builder.addCase(deleteTask.rejected, (state, action) => {
			state.deleteStatus = 'error';
			state.deleteErrorMessage = action.error.message ?? 'Ошибка при удалении задачи';
		});
		builder.addCase(deleteTask.pending, (state) => {
			state.deleteStatus = 'pending';
		});
	}
});

export default taskSlice.reducer;
export const taskActions = taskSlice.actions;
