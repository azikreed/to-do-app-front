import { FormEvent, useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import Headling from '../../components/Headling/Headling';
import Input from '../../components/Input/Input';
import styles from './AddTask.module.css';
import { createTask, getTaskById, taskActions, updateTask } from '../../store/task.slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { Snackbar } from '../../components/Snackbar/Snackbar';
import { useParams } from 'react-router-dom';

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
	const { task, actionStatus } = useSelector((s: RootState) => s.task);
	const { id } = useParams<{ id: string }>();
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		deadline: ''
	});


	useEffect(() => {
		if (id) {
			dispatch(getTaskById(id));
		}
	}, [dispatch, id]);

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		dispatch(taskActions.clearCreateErrorMessage());
		const target = e.target as typeof e.target & CreateTask;
		const { title, description, deadline } = target;
		if (id) {
			await sendTask(id, title.value, description.value, deadline.value, true);
		} else {
			await sendTask('', title.value, description.value, deadline.value, false);
		}
	};

	const sendTask = async (taskId: string, title: string, description: string, deadline: Date, isUpdate: boolean) => {
		if (isUpdate) {
			dispatch(updateTask({ taskId, title, description, deadline: new Date(deadline) }));
		} else {
			dispatch(createTask({ title, description, deadline: new Date(deadline) }));
		}
	};

	useEffect(() => {
		if (actionStatus === 'success' || actionStatus === 'error') {
			const timer = setTimeout(() => {
				dispatch(taskActions.clearActionStatus());
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [actionStatus, dispatch]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		});
	};

	return (
		<div className={styles['add-task']}>
			<Headling>Добавить таск</Headling>
			<form className={styles['add-form']} onSubmit={submit}>
				<div className={styles['field']}>
					<label htmlFor="title">Заголовок таска</label>
					<Input name='title' id='title'  value={formData.title} onChange={handleChange} placeholder='Заголовок'/>
				</div>
				<div className={styles['field']}>
					<label htmlFor="description">Описание таска</label>
					<Input name='description' id='description' value={formData.description} onChange={handleChange} placeholder='Описание'/>
				</div>
				<div className={styles['field']}>
					<label htmlFor="deadline">Дедлайн таска</label>
					<Input name='deadline' id='deadline' value={formData.deadline} onChange={handleChange} type='date' placeholder='Дедлайн'/>
				</div>
				<Button className={styles['add-btn']}>
					{id ? 'Обновить' : 'Добавить'}
				</Button>
			</form>
			{actionStatus === 'success' && <Snackbar status='success' />}
			{actionStatus === 'error' && <Snackbar status='error' />}
		</div>
	);
}