import { LOADING_UI, CLEAR_ERRORS, SET_CLIENTS, SET_CLIENT } from '../types'
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

export const addClient = (params: any, history: any) => {
	axios
		.post('users', params)
		.then(res => {
			history.push('/clients')
		})
		.catch(err => {
			console.log(err)
		})
}

export const updateClient = (params: any, history: any, props: any) => {
	axios
		.patch(`users/${params.id}`, params)
		.then(res => {
			history.push('/Clients')
		})
		.catch(err => {
			console.log(err)
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
			console.log(err)
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