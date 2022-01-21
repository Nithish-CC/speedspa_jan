import { LOADING_UI, CLEAR_ERRORS, SET_ERRORS, BUTTON_LOADING, LOADING_CLEAR, SET_CLIENTS, SET_CLIENT } from '../types'
import axios from 'axios'

export const getAllClients = (params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/users/all`, { params })
		.then(res => {
			dispatch({
				type: SET_CLIENTS,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const searchClients = (params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/users/search`, { params })
		.then(res => {
			dispatch({
				type: SET_CLIENTS,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const addClient = (params: any, history: any) => (dispatch: any) => {
	dispatch({ type: BUTTON_LOADING })
	axios
		.post('users', params)
		.then(res => {
			history.push('/clients')
			dispatch({ type: LOADING_CLEAR })
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			})
			dispatch({ type: LOADING_CLEAR })
		})
}

export const updateClient = (params: any, history: any) => (dispatch: any) => {
	dispatch({ type: BUTTON_LOADING })
	axios
		.patch(`users/${params.id}`, params)
		.then(res => {
			history.push('/Clients')
			dispatch({ type: LOADING_CLEAR })
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			})
			dispatch({ type: LOADING_CLEAR })
		})
}

export const getClientDetails = (clientId: any, params: any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/users/${clientId}`, { params })
		.then(res => {
			dispatch({
				type: SET_CLIENT,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			})
		})
}

export const deleteClient = (clientId: any, params: any) => (dispatch: any) => {
	axios
		.delete(`/users/${clientId}`, { params })
		.then(res => {
		})
		.catch(err => {
			console.log(err)
		})
}

export const uploadClients = (params: any, history: any) => (dispatch: any) => {
	dispatch({ type: BUTTON_LOADING })
	axios
		.post('clients/upload', params)
		.then(res => {
			history.push('/clients')
			dispatch({ type: LOADING_CLEAR })
		})
		.catch(err => {
			dispatch({
				type: SET_ERRORS,
				payload: err.response.data,
			})
			dispatch({ type: LOADING_CLEAR })
		})
}