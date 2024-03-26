import { useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { getProfile, userActions } from '../../store/user.slice';
import { useEffect } from 'react';

export function Layout() {
	// const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	// const profile = useSelector((s: RootState) => s.user.profile);

	useEffect(() => {
		dispatch(getProfile());
	}, [dispatch]);

	// const logout = () => {
	// 	dispatch(userActions.logout());
	// 	navigate('/auth/login');
	// };

	return <div className={styles['layout']}>
		{/* <div className={styles['sidebar']}>
			<div className={styles['user']}>
				<img src="/avatar.png" alt="avatar" className={styles['avatar']}/>
				<div className={styles['name']}>{profile?.name}</div>
				<div className={styles['email']}>{profile?.email}</div>
			</div>
			<div className={styles['menu']}>
				<NavLink to="/" className={({isActive})=>cn(styles['link'], {
					[styles.active]: isActive
				})}>
					<img src="/menu-icon.svg" alt="menu icon" />
				Menu
				</NavLink>
				<NavLink to="/cart" className={({isActive})=>cn(styles['link'], {
					[styles.active]: isActive
				})}>
					<img src="/cart-icon.svg" alt="cart icon" />
				Cart
				</NavLink>
			</div>
			<Button onClick={logout} className={styles['exit']}>
				<img src="/exit-icon.svg" alt="" />
				Выход
			</Button>
		</div>
		<div className={styles['content']}>
			<Outlet/>
		</div> */}
	</div>;
}