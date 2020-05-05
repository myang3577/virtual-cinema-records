import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changePassword } from '../actions/loginActions';
import { GlobalState } from '../reducers/rootReducer';
import { PasswordField } from '../components/Password';
import { LoadingButton } from '../components/LoadingButton';

function ChangePassword() {
	const [localPassword, setLocalPassword] = useState('');
	const [newLocalPassword, setNewLocalPassword] = useState('');
	const [newRepeatLocalPassword, setNewRepeatLocalPassword] = useState('');

	const username: any = useSelector<GlobalState>(
		(state) => state.loginData.username
	);

	const feedback: any = useSelector<GlobalState>(
		(state) => state.loginData.passwordChangeFeedback
	);

	const dispatch = useDispatch();

	const handleSubmit = () => {
		if (
			localPassword === '' ||
			newLocalPassword === '' ||
			newRepeatLocalPassword === ''
		) {
			alert(
				'Your current password, new password, or confirm password is empty. Please provide' +
					' both your current password, a new password, and a confirm password'
			);
		} else if (newLocalPassword !== newRepeatLocalPassword) {
			alert('Your new password does not match your confirm password');
		} else {
			dispatch(
				changePassword(
					username,
					localPassword,
					newLocalPassword,
					newRepeatLocalPassword
				)
			);
		}
	};

	return (
		<div className='user-form'>
			<PasswordField
				password={localPassword}
				loading={false}
				setPassword={setLocalPassword}
				placeholder={'Old Password'}
			/>
			<div className='divider'></div>
			<PasswordField
				password={newLocalPassword}
				loading={false}
				setPassword={setNewLocalPassword}
				placeholder={'New Password'}
			/>
			<div className='divider'></div>
			<PasswordField
				password={newRepeatLocalPassword}
				loading={false}
				setPassword={setNewRepeatLocalPassword}
				placeholder={'Confirm Password'}
			/>
			<div className='divider'></div>
			<LoadingButton onClick={handleSubmit} loading={false}>
				Submit
			</LoadingButton>
			{feedback}
		</div>
	);
}

export default ChangePassword;
