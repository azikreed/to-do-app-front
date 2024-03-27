import { FormEvent, useEffect } from 'react';
import Button from '../../components/Button/Button';
import Headling from '../../components/Headling/Headling';
import Input from '../../components/Input/Input';
import styles from './AddTask.module.css';
import { createTask, taskActions } from '../../store/task.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { Snackbar } from '../../components/Snackbar/Snackbar';

export interface CreateTask {
    title: {
        value: string;
    }
    description: {
        value: string;
    }
	deadline: {
		value: Date
	}
}

export function AddTask() {
	const dispatch = useDispatch<AppDispatch>();
	const { actionStatus } = useSelector((s: RootState) => s.task);

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		dispatch(taskActions.clearTaskErrorMessage());
		const target = e.target as typeof e.target & CreateTask;
		const { title, description, deadline } = target;
		await sendTask(title.value, description.value, deadline.value);
	};

	const sendTask = async (title: string, description: string, deadline: Date) => {
		dispatch(createTask({title, description, deadline}));
	};

	useEffect(() => {
		if (actionStatus === 'success' || actionStatus === 'error') {
			const timer = setTimeout(() => {
				dispatch(taskActions.clearActionStatus());
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [actionStatus, dispatch]);

	return (
		<div className={styles['add-task']}>
			<Headling>Добавить таск</Headling>
			<form className={styles['add-form']} onSubmit={submit}>
				<div className={styles['field']}>
					<label htmlFor="title">Заголовок таска</label>
					<Input name='title' id='title' placeholder='Заголовок'/>
				</div>
				<div className={styles['field']}>
					<label htmlFor="description">Описание таска</label>
					<Input name='description' id='description' placeholder='Описание'/>
				</div>
				<div className={styles['field']}>
					<label htmlFor="deadline">Дедлайн таска</label>
					<Input name='deadline' id='deadline' type='date' placeholder='Дедлайн'/>
				</div>
				<Button className={styles['add-btn']}>
					Добавить
				</Button>
			</form>
			{actionStatus === 'success' && <Snackbar status='success' />}
			{actionStatus === 'error' && <Snackbar status='error' />}
		</div>
	);
}