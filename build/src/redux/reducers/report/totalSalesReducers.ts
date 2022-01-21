import {SET_REPORT_TOTAL_SALES} from '../../types'

export type State = Readonly<{
    reportTotalSales: []
}>

const initialState: State = {
    reportTotalSales: [],
}


export default function allreportReducers(state = initialState, action: any) {
    switch (action.type) {
        case SET_REPORT_TOTAL_SALES:
            return {
                ...state,
                reportTotalSales: action.payload,
            }
        default:
            return state
    }
}
