import jwtDecode from 'jwt-decode'
import { logoutUser, getUserData } from '../redux/actions/userActions'
import store from '../redux/store'
import axios from 'axios'
import { SET_AUTHENTICATED } from '../redux/types'

export const CheckAuthentication = () => {
	const authToken = localStorage.token
	if (authToken) {
		const decodedToken: any = jwtDecode(authToken)
		
		if (decodedToken.exp * 1000 < Date.now()) {
			store.dispatch(logoutUser())
		} else {
			store.dispatch({ type: SET_AUTHENTICATED })
			axios.defaults.headers.common.Authorization = authToken
			axios.defaults.headers.common['x-mothership-key'] = localStorage.businessId
			store.dispatch(getUserData())
		}
	}
}
