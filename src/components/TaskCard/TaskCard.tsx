import styles from './TaskCard.module.css';
import { TaskCardProps } from './TaskCard.props';
import cn from 'classnames';

export function TaskCard({children, className, id, onDelete}: TaskCardProps) {
	return (
		<div className={cn(styles['task-card'], className)}>
			<h2 className={styles['title']}>{children}</h2>
			<div className={styles['actions']}>
				<button className={styles['btn']}>
					<img src="/done_icon_btn.svg" alt="" />
				</button>
				<button onClick={() => onDelete(id)} className={styles['btn']}>
					<img src="/trash_icon_btn.svg" alt="" />
				</button>
			</div>
		</div>
	);
}