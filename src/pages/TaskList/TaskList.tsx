import { useDispatch, useSelector } from 'react-redux';
import Headling from '../../components/Headling/Headling';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import styles from './TaskList.module.css';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect } from 'react';
import { getTasks } from '../../store/task.slice';

export function TaskList() {
	const dispatch = useDispatch<AppDispatch>();
	const tasks = useSelector((s: RootState) => s.task.tasks);

	useEffect(() => {
		dispatch(getTasks());
	}, [dispatch]);

	return (
		<div className={styles['list']}>
			<Headling appearance='small'>Таски</Headling>
			{tasks?.map((task) => (
				<TaskCard id={task._id}>{task.title}</TaskCard>
			))}
		</div>
	);
}