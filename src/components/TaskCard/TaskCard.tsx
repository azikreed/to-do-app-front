import { Link } from 'react-router-dom';
import styles from './TaskCard.module.css';
import { TaskCardProps } from './TaskCard.props';
import cn from 'classnames';

export function TaskCard({children, className, id, onDelete, onUpdate, type}: TaskCardProps) {
	return (
		<Link to={`/task/${id}`} className={cn(styles['task-card'], className)}>
			<h2 className={cn(
				styles['title'],
				{
					[styles['done']]: type === 'done'
				}
			)}>{children}</h2>
			<div className={styles['actions']}>
				{type === 'get' ? (
					<button onClick={() => onUpdate(id)} className={styles['btn']}>
						<img src="/done_icon_btn.svg" alt="" />
					</button>
				) : (
					<></>
				)}
				<button onClick={() => onDelete(id)} className={styles['btn']}>
					<img src="/trash_icon_btn.svg" alt="" />
				</button>
			</div>
		</Link>
	);
}