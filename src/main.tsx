import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Error } from './pages/Error/Error.tsx';
import { Layout } from './layouts/Layout/Layout.tsx';
import { AuthLayout } from './layouts/Auth/AuthLayout.tsx';
import { Login } from './pages/Login/Login.tsx';
import { Register } from './pages/Register/Register.tsx';
import { RequireAuth } from './helpers/RequireAuth.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RequireAuth><Layout/></RequireAuth>
	},
	{
		path: '/auth',
		element: <AuthLayout/>,
		children: [
			{
				path:'login',
				element: <Login/>
			},
			{
				path:'register',
				element: <Register/>
			}
		]
	},
	{
		path: '*',
		element: <Error/>
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router}/>
		</Provider>
	</React.StrictMode>
);
