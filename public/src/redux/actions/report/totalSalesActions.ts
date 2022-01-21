import { LOADING_UI, CLEAR_ERRORS, SET_REPORT_TOTAL_SALES} from '../../types'
import axios from 'axios'

export const searchTotalSales = () => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get("http://demo-api.savantsaloncrm.com/reports/total_sales?begin_time=2020-12-31T18:30:00.000Z&businessId=604b869e1691d978b510a4a9&end_time=2021-07-20T18:29:59.999Z")
		.then(res => {
			dispatch({
				type: SET_REPORT_TOTAL_SALES,
				payload: res.data,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}