import { useDispatch, useSelector } from 'react-redux';
import Headling from '../../components/Headling/Headling';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import styles from './TaskList.module.css';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect, useState } from 'react';
import { deleteTask, getTasks, taskActions, updateTask } from '../../store/task.slice';
import { Snackbar } from '../../components/Snackbar/Snackbar';
import { useLocation } from 'react-router-dom';

export function TaskList() {
	const {pathname} = useLocation();
	const [location, setLocation] = useState<'get' | 'done'>(pathname === '/' ? 'get' : pathname === '/done' ? 'done' : 'get');
	const dispatch = useDispatch<AppDispatch>();
	const { tasks, actionStatus } = useSelector((s: RootState) => s.task);

	useEffect(() => {
		if(pathname === '/done') {
			setLocation('done');
		} else if(pathname !== '/done') {
			setLocation('get');
		}
	},[pathname, location]);

	const deleteOne = async (id: string) => {
		await dispatch(deleteTask(id));
	};

	const done = async (id: string) => {
		await dispatch(updateTask({taskId: id, done: true}));
	};

	useEffect(() => {
		console.log('LOCATION==============', location);
		dispatch(getTasks(location));
	}, [dispatch, location]);

	useEffect(() => {
		if (actionStatus === 'success' || actionStatus === 'error') {
			const timer = setTimeout(() => {
				dispatch(taskActions.clearActionStatus());
			}, 3000); // Скрыть статус после 3 секунд

			return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
		}
	}, [actionStatus, dispatch]);

	return (
		<div className={styles['list']}>
			<Headling appearance="small">Таски</Headling>
			<div className={styles['tasks']}>
				{tasks?.map((task) => (
					<TaskCard key={task._id} id={task._id} onDelete={deleteOne} onUpdate={done} type={location}>
						{task.title}
					</TaskCard>
				))}
			</div>
			{actionStatus === 'success' && <Snackbar status='success' />}
			{actionStatus === 'error' && <Snackbar status='error' />}
		</div>
	);
}
