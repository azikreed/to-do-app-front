import { forwardRef } from 'react';
import styles from './Input.module.css';
import cn from 'classnames';
import { InputProps } from './Input.props';

const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ isValid = true, className, ...props}, ref) {
	return (
		<input {...props} ref={ref} className={cn(styles['input'],className, styles['input'], {
			[styles['invalid']]: isValid
		})} />
	);
});

export default Input;
