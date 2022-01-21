import { LOADING_UI, CLEAR_ERRORS, SET_TOTAL_SALES, SET_THIRTY_DAY_SNAPSHOT } from '../types'
import axios from 'axios'

export const getTodayTodaySales = (params:any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/reports/total_sales`, {params})
		.then(res => {
            let totalSaleReports = res.data && res.data.length ? res.data[0] : {};
            totalSaleReports.summaryOfAmount = parseFloat(totalSaleReports.summaryOfAmount).toFixed(2);
            totalSaleReports.summaryOfTip = parseFloat(totalSaleReports.summaryOfTip).toFixed(2);
            totalSaleReports.summaryOfTax = parseFloat(totalSaleReports.summaryOfTax).toFixed(2);
            totalSaleReports.summaryOfTotal = parseFloat(totalSaleReports.summaryOfTotal).toFixed(2);
            totalSaleReports.total = totalSaleReports.total;
			dispatch({
				type: SET_TOTAL_SALES,
				payload: totalSaleReports,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}

export const getThirtyDaySnapshot = (params:any) => (dispatch: any) => {
	dispatch({ type: LOADING_UI })
	axios
		.get(`/reports/thirty_day_snapshot`, {params})
		.then(res => {
            let thirtyDaySnapshotReports = res.data && res.data.length ? res.data[0] : {};
            thirtyDaySnapshotReports.customerCount = thirtyDaySnapshotReports.customerCount;
            thirtyDaySnapshotReports.newCustomerCount = thirtyDaySnapshotReports.newCustomerCount;
            thirtyDaySnapshotReports.returningCustomerCount = thirtyDaySnapshotReports.returningCustomerCount;
            thirtyDaySnapshotReports.averageAmount = parseFloat(thirtyDaySnapshotReports.averageAmount).toFixed(2);
            thirtyDaySnapshotReports.averageVisitCount = thirtyDaySnapshotReports.averageVisitCount;
            thirtyDaySnapshotReports.averagePreBooking = thirtyDaySnapshotReports.averagePreBooking;
			dispatch({
				type: SET_THIRTY_DAY_SNAPSHOT,
				payload: thirtyDaySnapshotReports,
			})
			dispatch({ type: CLEAR_ERRORS })
		})
		.catch(err => {
			console.log(err)
		})
}
