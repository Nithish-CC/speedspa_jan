import { LOADING_UI, CLEAR_ERRORS, SET_BUSINESS_DETAILS } from '../types'
import axios from 'axios'

export const getBusinessDetails = (hostname:any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/business/details?name=${hostname}`)
		.then(res => {
			axios.defaults.headers.common['x-mothership-key'] = res.data.id
			localStorage.setItem('businessUrl', `${hostname}`)
			localStorage.setItem('businessDetails', `${JSON.stringify(res.data)}`)
			localStorage.setItem('logo', `${res.data.logo}`)
			localStorage.setItem('businessId', `${res.data.id}`)
			dispatch({
				type: SET_BUSINESS_DETAILS,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

//For Schedule page
export const getUserBusinessDetails = (params:any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/business/details`,{params})
		.then(res => {
			dispatch({
				type: SET_BUSINESS_DETAILS,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}