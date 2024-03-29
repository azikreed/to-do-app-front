import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getProfile, userActions } from '../../store/user.slice';
import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';
import cn from 'classnames';

export function Layout() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const profile = useSelector((s: RootState) => s.user.profile);

	useEffect(() => {
		dispatch(getProfile());
	}, [dispatch]);

	const logout = () => {
		dispatch(userActions.logout());
		navigate('/auth/login');
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return <div className={`${styles['layout']} ${isSidebarOpen ? styles['sidebar-open'] : ''}`}>
		<div className={cn({
			[styles['sidebar']]: isSidebarOpen,
			[styles['toggle']]: !isSidebarOpen
		})}>
			<div className={styles['user']}>
				<div className={styles['name']}>{profile?.name}</div>
				<div className={styles['email']}>{profile?.email}</div>
			</div>
			<div className={cn(styles['menu'], {
				[styles['toggle']]: isSidebarOpen 
			})}>
				<NavLink to="/" className={({isActive})=>cn(styles['link'], {
					[styles.active]: isActive
				})}>
				Все таски
				</NavLink>
				<NavLink to="/add" className={({isActive})=>cn(styles['link'], {
					[styles.active]: isActive
				})}>
					<img src="/plus_icon.svg" alt="" className={styles['link-icon']} />
				Добавить
				</NavLink>
				<NavLink to="/done" className={({isActive})=>cn(styles['link'], {
					[styles.active]: isActive
				})}>
					<img src="/done_icon.svg" alt="" className={styles['link-icon']} />
				Выполненные
				</NavLink>
			</div>
			<Button onClick={logout} className={styles['exit']} appearance='small'>
				Выход
			</Button>
		</div>
		<div className={styles['content']}>
			<Button appearance='rounded' className={styles['toggle-button']} onClick={toggleSidebar}>
				{isSidebarOpen ? <img src='/arrow_left.svg'/> : <img src='/arrow_right.svg'/>}
			</Button>
			<div className={styles['box']}>
				<Outlet/>
			</div>
		</div>
	</div>;
}