import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadState } from './storage';
import { LoginResponse } from '../interfaces/auth.interface';
import axios, { AxiosError } from 'axios';
import { PREFIX } from '../helpers/API';
import { Profile } from '../interfaces/user.interface';
import { RootState } from './store';

export const JWT_PERSISTANT_STATE = 'userData';

export interface UserPersistantState {
    jwt: string | null;
}

export interface UserState {
    jwt: string | null;
    loginErrorMessage?: string;
    registerErrorMessage?: string;
    profile?: Profile;
}

const initialState: UserState = {
	jwt: loadState<UserPersistantState>(JWT_PERSISTANT_STATE)?.jwt ?? null
};

export const login = createAsyncThunk('user/login',
	async (params: {email: string, password: string}) => {
		try {
			const {data} = await axios.post<LoginResponse>(`${PREFIX}/user/login`, {
				email: params.email,
				password: params.password
			});
			console.log(data);
			return data;
		} catch (e) {
			if(e instanceof AxiosError){
				throw new Error(e.message);
			}
		}
	}
);

export const register = createAsyncThunk('user/register',
	async (params: {name: string,email: string, password: string}) => {
		try {
			const {data} = await axios.post<LoginResponse>(`${PREFIX}/user/register`, {
				email: params.email,
				password: params.password,
				name: params.name
			});
			return data;
		} catch (e) {
			if(e instanceof AxiosError){
				throw new Error(e.message);
			}
		}
	}
);

export const getProfile = createAsyncThunk<Profile, void, {state: RootState}>('user/info',
	async (_, thunkApi) => {
		const jwt = thunkApi.getState().user.jwt;

		const {data} = await axios.get<Profile>(`${PREFIX}/user/info`, {
			headers: {
				Authorization: `Bearer ${jwt}`
			}
		});
		return data;
	}
);

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: (state) => {
			state.jwt = null;
		},
		clearLoginError: (state) => {
			state.loginErrorMessage = undefined;
		},
		clearRegisterError: (state) => {
			state.registerErrorMessage = undefined;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(login.fulfilled, (state, action) => {
			if(!action.payload) {
				return;
			}
			state.jwt = action.payload.token;
		});
		builder.addCase(login.rejected, (state, action) => {
			state.loginErrorMessage = action.error.message;
		});

		builder.addCase(getProfile.fulfilled, (state, action) => {
			state.profile = action.payload;
		});

		builder.addCase(register.fulfilled, (state, action) => {
			if(!action.payload) {
				return;
			}
			console.log(action.payload);
			state.jwt = action.payload.token;
		});
		builder.addCase(register.rejected, (state, action) => {
			state.registerErrorMessage = action.error.message;
		});
	}
});

export default userSlice.reducer;
export const userActions = userSlice.actions;