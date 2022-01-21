import { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import { loginUser } from '../redux/actions/userActions'
import { getBusinessDetails } from '../redux/actions/businessActions'
import '../scss/login.scss'

const Login = (props: any) => {
	const [values, setValues] = useState({
		email: '',
		password: '',
	})
	const [errors, setErrors] = useState({} as Error)
	const [loading, setLoading] = useState(false)


	const hostname = 'demo-sofabnails.savantsaloncrm.com'
	// const hostname = window.location.hostname

	const getBussinessDetails = () => {
		props.getBusinessDetails(hostname)
	}

	const UI = useSelector((state: any) => state.UI)

	useEffect(() => {
		getBussinessDetails()
		if (UI.errors) {
			setErrors(UI.errors)
		}
		setLoading(UI.loading)
	}, [hostname])


	const handleSubmit = (e: any) => {
		e.preventDefault()
		setLoading(UI.loading)
		const userData = {
			email: values.email,
			password: values.password,
		}
		props.loginUser(userData, props.history)
	}

	const handleChange = (e: any) => {
		e.persist()
		setValues(values => ({
			...values,
			[e.target.name]: e.target.value,
		}))
	}

	return (
		<div id="login" className='middle-box text-center loginscreen animated fadeInDown'>
			<div>
				<div>
					<h1 className='logo-name'>
						<img src={process.env.PUBLIC_URL+'assets/logo.png'} alt="VNS logo" style={{ width: '75%' }} />
					</h1>
				</div>
				<form className='m-t'>
					<h3>Login with email:</h3>
					{errors.message && (
						<h3><span className='text-danger'>{errors.message}</span></h3>
					)}
					<div className='form-group'>
						<input type='email'
							className='form-control'
							placeholder='Email'
							id='email'
							name='email'
							onChange={handleChange} required />
					</div>
					<div className='form-group'>
						<input type='password'
							className='form-control'
							placeholder='Password'
							id='password'
							name='password'
							onChange={handleChange}
							required />
					</div>
					<button
						className='btn btn-primary block full-width m-b'
						onClick={e => handleSubmit(e)}
						disabled={UI.loading} >
						{UI.loading ? 'Login…' : 'Login'}
					</button>
				</form>
			</div>
		</div>
	)
}

const mapActionsToProps = {
	loginUser,
	getBusinessDetails
}

export default connect(null, mapActionsToProps)(Login)
