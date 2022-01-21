import { SET_USER, SET_AUTHENTICATED, SET_UNAUTHENTICATED, LOADING_USER, SET_CLIENTS, SET_CLIENT } from '../types'

export type State = Readonly<{
	authenticated: boolean,
	credentials: object,
	loading: boolean,
	allClients: [],
	clientInfo: object
}>

const initialState: State = {
	authenticated: false,
	credentials: {},
	loading: false,
	allClients: [],
	clientInfo: {},
}

export default function userReducers(state = initialState, action: any) {
	switch (action.type) {
		case SET_AUTHENTICATED:
			return {
				...state,
				authenticated: true,
			}
		case SET_UNAUTHENTICATED:
			return initialState
		case SET_USER:
			return {
				...state,
				authenticated: true,
				loading: false,
				credentials: action.payload,
			}
		case LOADING_USER:
			return {
				...state,
				loading: true,
			}
		case SET_CLIENTS:
			return {
				...state,
				allClients: action.payload,
			}
		case SET_CLIENT:
			return {
				...state,
				clientInfo: action.payload,
			}
		default:
			return state
	}
}
