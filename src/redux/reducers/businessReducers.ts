import { SET_BUSINESS_DETAILS } from '../types'

export type State = Readonly<{
	businessDetails: object,
}>

const initialState: State = {
	businessDetails: {}
}

export default function businessReducers(state = initialState, action: any) {
	switch (action.type) {
		case SET_BUSINESS_DETAILS:
			return {
				...state,
				authenticated: false,
				loading: false,
				businessDetails: action.payload,
			}
		default:
			return state
	}
}
