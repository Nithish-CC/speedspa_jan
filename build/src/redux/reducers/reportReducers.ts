import { SET_TOTAL_SALES, SET_THIRTY_DAY_SNAPSHOT } from '../types'

export type State = Readonly<{
    totalSales: object,
    thirtyDaySnapshot: object,
}>

const initialState: State = {
    totalSales: {},
    thirtyDaySnapshot: {},
}

export default function reportReducers(state = initialState, action: any) {
	switch (action.type) {
        case SET_TOTAL_SALES:
            return {
                ...state,
                totalSales: action.payload,
            }
        case SET_THIRTY_DAY_SNAPSHOT:
            return {
                ...state,
                thirtyDaySnapshot: action.payload,
            }
		default:
			return state
	}
}
