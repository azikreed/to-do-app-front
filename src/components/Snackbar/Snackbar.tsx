import styles from './Snackbar.module.css';
import { SnackbarProps } from './Snackbar.props';
import cn from 'classnames';

export function Snackbar({message, status}: SnackbarProps) {
	return <div className={cn(styles['message'], {
		[styles['error']]: status === 'error',
		[styles['success']]: status === 'success'
	})}>{message}</div>;
}