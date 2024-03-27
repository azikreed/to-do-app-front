import { useDispatch, useSelector } from 'react-redux';
import Headling from '../../components/Headling/Headling';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import styles from './TaskList.module.css';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect } from 'react';
import { deleteTask, getTasks, taskActions } from '../../store/task.slice';
import { Snackbar } from '../../components/Snackbar/Snackbar';

export function TaskList() {
	const dispatch = useDispatch<AppDispatch>();
	const { tasks, actionStatus } = useSelector((s: RootState) => s.task);

	const deleteOne = async (id: string) => {
		await dispatch(deleteTask(id));
	};

	useEffect(() => {
		dispatch(getTasks());
	}, [dispatch]);

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
					<TaskCard key={task._id} id={task._id} onDelete={deleteOne}>
						{task.title}
					</TaskCard>
				))}
			</div>
			{actionStatus === 'success' && <Snackbar status='success' message="Удалено успешно" />}
			{actionStatus === 'error' && <Snackbar status='error' message="Ошибка при удалении" />}
		</div>
	);
}
