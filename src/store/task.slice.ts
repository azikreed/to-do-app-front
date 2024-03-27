import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { TaskResponse } from '../interfaces/task.interface';
import { PREFIX } from '../helpers/API';
import { RootState } from './store';

const getRequestConfig = (token: string | null): AxiosRequestConfig => ({
	headers: {
		Authorization: `Bearer ${token}`
	}
});

export interface TaskModel {
	_id?: string;
  title: string;
  description: string;
  deadline: Date;
}

export interface TaskUpdateModel {
	taskId: string;
	title?: string;
	description?: string;
	deadline?: Date;
	done?: boolean;
}

export interface TaskState {
  tasks: TaskResponse[] | null;
  actionStatus: 'idle' | 'pending' | 'success' | 'error';
  deleteErrorMessage?: string;
  createErrorMessage?: string;
}

const initialState: TaskState = {
	tasks: null,
	actionStatus: 'idle'
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
  TaskResponse[],
  void,
  { state: RootState }
>('task/get', async (_, thunkApi) => {
	const token = thunkApi.getState().user.jwt;

	const { data } = await axios.get<TaskResponse[]>(
		`${PREFIX}/task/get`,
		getRequestConfig(token)
	);
	return data;
});


export const createTask = createAsyncThunk<TaskResponse, TaskModel, { state: RootState }>('task/create',
	async (params: TaskModel, thunkApi) => {
		const token = thunkApi.getState().user.jwt;
		try {
			const {data} = await axios.post<TaskResponse>(`${PREFIX}/task/create`, {
				title: params.title,
				description: params.description,
				deadline: params.deadline
			}, getRequestConfig(token));
			return data;
		} catch (e) {
			if(e instanceof AxiosError){
				throw new Error(e.message);
			}
			throw e;
		}
	}
);

export const updateTask = createAsyncThunk<TaskResponse, TaskUpdateModel, { state: RootState }>('task/update',
	async (params: TaskUpdateModel, thunkApi) => {
		const token = thunkApi.getState().user.jwt;
		try {
			const { taskId, title, deadline, description, done } = params;
			const {data} = await axios.patch<TaskResponse>(`${PREFIX}/task/update/${taskId}`, {
				title: title,
				description: description,
				deadline: deadline,
				done: done
			}, getRequestConfig(token));
			return data;
		} catch (e) {
			if(e instanceof AxiosError){
				throw new Error(e.message);
			}
			throw e;
		}
	}
);

export const taskSlice = createSlice({
	name: 'task',
	initialState,
	reducers: {
		clearDeleteError: (state) => {
			state.deleteErrorMessage = undefined;
		},
		clearActionStatus: (state) => {
			state.actionStatus = 'idle';
		},
		clearCreateErrorMessage: (state) => {
			state.createErrorMessage = undefined;
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
			state.actionStatus = 'success';
			state.tasks = state.tasks!.filter((task) => task._id !== action.payload);
		});
		builder.addCase(deleteTask.rejected, (state, action) => {
			state.actionStatus = 'error';
			state.deleteErrorMessage = action.error.message ?? 'Ошибка при удалении задачи';
		});
		builder.addCase(deleteTask.pending, (state) => {
			state.actionStatus = 'pending';
		});

		builder.addCase(createTask.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.actionStatus = 'success';
			console.log(action.payload);
			state.tasks?.push(action.payload);
		});
		builder.addCase(createTask.rejected, (state, action) => {
			state.actionStatus = 'error';
			state.createErrorMessage = action.error.message ?? 'Ошибка при добавлении задачи';
		});
		builder.addCase(createTask.pending, (state) => {
			state.actionStatus = 'pending';
		});

		builder.addCase(updateTask.fulfilled, (state, action) => {
			if (!action.payload) {
				return;
			}
			state.actionStatus = 'success';
			console.log(action.payload);
			state.tasks = state.tasks!.filter((task) => task._id !== action.payload._id);
		});
		builder.addCase(updateTask.rejected, (state, action) => {
			state.actionStatus = 'error';
			state.createErrorMessage = action.error.message ?? 'Ошибка при добавлении задачи';
		});
		builder.addCase(updateTask.pending, (state) => {
			state.actionStatus = 'pending';
		});
	}
});

export default taskSlice.reducer;
export const taskActions = taskSlice.actions;
