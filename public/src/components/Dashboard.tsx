import { useState, useEffect } from 'react'
import { connect, useSelector } from 'react-redux'
import './../scss/dashboard.scss'
import { getTodayTodaySales, getThirtyDaySnapshot } from '../redux/actions/reportActions'
import moment from "moment"
import PageHeader from '../components/core/PageHeader'

const Dashboard = (props: any) => {
	const [errors, setErrors] = useState({} as Error)

	const getTodayTodaySales = () => {
		const params = {
			begin_time: moment().startOf('day').toISOString(),
			end_time: moment().endOf('day').toISOString(),
			businessId: localStorage.businessId
		}
		props.getTodayTodaySales(params)
	}

	const getThirtyDaySnapshot = () => {
		const params = {
			begin_time: moment().startOf('day').toISOString(),
			end_time: moment().endOf('day').toISOString(),
			businessId: localStorage.businessId
		}
		props.getThirtyDaySnapshot(params)
	}

	const UI = useSelector((state: any) => state.UI)
	const user = useSelector((state: any) => state.user)
	const totalSales = useSelector((state: any) => state.report.totalSales)
	const thirtyDaySnapshot = useSelector((state: any) => state.report.thirtyDaySnapshot)

	const [title] = useState(`Welcome, ` + user.credentials.firstName + ` ` + user.credentials.lastName + `!`);

	useEffect(() => {
		getTodayTodaySales()
		getThirtyDaySnapshot()
		if (UI.errors) {
			setErrors(UI.errors)
		}
	}, [])

	return (
		<>
			{user.authenticated && !UI.loading ?
				<>
					<PageHeader title={title} />
					<div id="dashboard" className="row">
						<div className="col-lg-12">
							<div className="wrapper wrapper-content animated fadeInRight">
								<h2> Today's Total Sales </h2>
								<div className="row" style={{ 'textTransform': 'uppercase' }}>
									{/* total customers */}
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<span className="customer_analysis_count">
													{'\u0024'}{totalSales.summaryOfAmount}
												</span>
												<p>Total Sales</p>
											</div>
										</div>
									</div>
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<span className="customer_analysis_count">
													{'\u0024'}{totalSales.summaryOfTip}
												</span>
												<p>Total Tips</p>
											</div>
										</div>
									</div>
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<span className="customer_analysis_count">
													{'\u0024'}{totalSales.summaryOfTax}
												</span>
												<p>Total Taxes</p>
											</div>
										</div>
									</div>
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<span className="customer_analysis_count">
													{'\u0024'}{totalSales.summaryOfTotal}
												</span>
												<p>Gross Revenue</p>
											</div>
										</div>
									</div>
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<span className="customer_analysis_count">
													{totalSales.total}
												</span>
												<p>Total Transactions</p>
											</div>
										</div>
									</div>
								</div>

								<h2> 30 Day Snapshot </h2>
								<div className="row">
									{/* total customers */}
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<i className="fa fa-users" style={{ 'fontSize': '4.5rem' }}></i>&nbsp;
												<span className="customer_analysis_count">
													{thirtyDaySnapshot.customerCount}
												</span>
												<p>TOTAL CUSTOMERS</p>
											</div>
										</div>
									</div>
									{/* new customers */}
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<i className="fa fa-user-plus" style={{ 'fontSize': '4.5rem' }}></i>&nbsp;
												<span className="customer_analysis_count">
													{thirtyDaySnapshot.newCustomerCount}
												</span>
												<p>NEW CUSTOMERS</p>
											</div>
										</div>
									</div>
									{/* returning customers */}
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<i className="fa fa-user" style={{ 'fontSize': '4.5rem' }}></i>&nbsp;
												<span className="customer_analysis_count">
													{thirtyDaySnapshot.returningCustomerCount}
												</span>
												<p>RETURNING CUSTOMERS</p>
											</div>
										</div>
									</div>
									{/* average $ per visit */}
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<span className="customer_analysis_count">
													{'\u0024'}{thirtyDaySnapshot.averageAmount}
												</span>
												<p>AVERAGE $ per VISIT</p>
											</div>
										</div>
									</div>
									{/* average visit per customer */}
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<i className="fa fa-user" style={{ 'fontSize': '4.5rem' }}></i>&nbsp;
												<span className="customer_analysis_count">
													{thirtyDaySnapshot.averageVisitCount}x
												</span>
												<p>AVERAGE VISITS per CUSTOMER</p>
											</div>
										</div>
									</div>
									{/* % of rebooking */}
									<div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12 customer_analysis">
										<div className="ibox float-e-margins m-b-none">
											<div className="ibox-content customer_analysis_content greenWhite">
												<span className="customer_analysis_count">
													{thirtyDaySnapshot.averagePreBooking}
												</span>
												&nbsp;<i className="fa fa-percent" style={{ 'fontSize': '3.5rem' }}></i>
												<p>% of RE-BOOKING</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
				:
				<></>
			}
		</>
	)
}

const mapActionsToProps = {
	getTodayTodaySales,
	getThirtyDaySnapshot,
}

export default connect(null, mapActionsToProps)(Dashboard)
