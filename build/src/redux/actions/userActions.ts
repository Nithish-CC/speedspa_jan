import { SET_USER, SET_ERRORS, LOADING_UI, CLEAR_ERRORS, SET_UNAUTHENTICATED, LOADING_USER } from '../types'
import axios from 'axios'

export const loginUser = (userData: any, history: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.post('auth/email', userData)
		.then(res => {
			const token = `Bearer ${res.data.token}`
			localStorage.setItem('token', `Bearer ${res.data.token}`)
			localStorage.setItem('userId', `${res.data.id}`)
			axios.defaults.headers.common.Authorization = token
			dispatch(getUserData())
			dispatch({ type: CLEAR_ERRORS })
			history.push('/')
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			})
		})
}

export const getUserData = () => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	const userId = localStorage.getItem('userId')
	axios
		.get(`/users/${userId}`)
		.then(res => {
			dispatch({
				type: SET_USER,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const logoutUser = () => (dispatch: any) => {
	localStorage.clear()
	delete axios.defaults.headers.common.Authorization
	delete axios.defaults.headers.common['x-mothership-key']
	dispatch({
		type: SET_UNAUTHENTICATED,
	})
	// window.location.href = '/login'
}
