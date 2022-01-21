import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../../redux/actions/userActions'

const SideMenu = (props: any) => {

	const handleClickLogout = (e: any) => {
		e.preventDefault()
		props.logoutUser()
	}

	const logo = localStorage.getItem('logo')

	return (
		<div>
			{props.authenticated && (
				<ul className="nav metismenu">
					<li className="nav-header">
						<div className="dropdown profile-element">
							<div style={{ display: 'block', textAlign: 'left', fontSize: '18px', padding: '10px 0', color: '#fff', fontWeight: 'bold' }}>
								<img alt="logo" src={logo ? logo : process.env.PUBLIC_URL+'assets/I-Salon-logo.png'} style={{ height: 'auto', border: '0', width: '50%', verticalAlign: 'middle' }} />
							</div>
							<a data-toggle="dropdown" className="dropdown-toggle">
								<span className="clear">
									<span className="block m-t-xs">
										<strong className="font-bold">{props.user.firstName} {props.user.lastName}</strong>
									</span>
									<span className="block m-t-xs">
										<strong className="font-bold">{props.user.countryCode} {props.user.phoneNumber}</strong>
									</span>
									<span className="text-muted text-xs block">{props.user.roles}
										<b className="caret"></b>
									</span>
								</span>
							</a>
							<ul className="dropdown-menu animated fadeInRight m-t-xs">
								{props.user.roles && props.user.roles.includes('admin') && (
									<React.Fragment>
										<li>
											<Link to="profile">Profile</Link>
										</li>
										<li className="divider"></li>
									</React.Fragment>
								)}
								<li onClick={handleClickLogout}>Logout</li>
							</ul>
						</div>
						<div className="logo-element">
							<img alt='sm-logo' src={'../assets/I-Salon-logo.png'} />
						</div>
					</li>
					<li>
						<Link to="/dashboard"><span className="nav-label">Dashboard</span></Link>
					</li>
					<li>
						<Link to="/clients"><span className="nav-label">Clients</span></Link>
					</li>
					<li>
						<a ui-sref="index.staff.staff"><span className="nav-label">Staff</span></a>
					</li>
					<li>
						<a ui-sref="index.schedule.schedule"><span className="nav-label">Schedule</span></a>
					</li>
					<li>
						<a ui-sref="index.staffschedule.staffschedule"><span className="nav-label">Staff Schedule</span></a>
					</li>
					<li>
						<a className="nav-second-level-label"><span className="nav-label">Services</span><span className="fa arrow"></span></a>
						<ul className="nav nav-second-level">
							<li>
								<a ui-sref="index.services.categories.all"><span className="nav-label">Categories</span></a>
							</li>
							<li>
								<a ui-sref="index.services.services"><span className="nav-label">Services</span></a>
							</li>
							<li>
								<a ui-sref="index.services.orders.all"><span className="nav-label">Orders</span></a>
							</li>
						</ul>
					</li>
					<li>
						<a className="nav-second-level-label"><span className="nav-label">Products</span><span className="fa arrow"></span></a>
						<ul className="nav nav-second-level">
							<li>
							<Link to="/products/categories"><span className="nav-label">Categories</span></Link>
							</li>
							<li> 
							<Link to="/categoryproducts"><span className="nav-label">Products</span></Link>
							</li>
							<li>
								<a ui-sref="index.products.orders.all"><span className="nav-label">Orders</span></a>
							</li>
						</ul>
					</li>
					<li>
						<a className="nav-second-level-label"><span className="nav-label">Reports</span><span className="fa arrow"></span></a>
						<ul className="nav nav-second-level">
							<li> 
							<Link to="/reports/total_sales"><span className="nav-label">Total Sales</span></Link>
							</li>
							<li>
							<Link to="/reports/estimated_payroll"><span className="nav-label">Estimated Payroll</span></Link>
							</li>
							<li> 
							<Link to="/reports/services_completed"><span className="nav-label">Services Completed</span></Link>
							</li>
							<li>
							<Link to="/reports/product_sales"><span className="nav-label">Product Sales</span></Link>
							</li>
							<li>
							<Link to="/reports/client_report"><span className="nav-label">Client Report</span></Link>
							</li>
							<li> 
							<Link to="/reports/staff_booking_analysis"><span className="nav-label">Staff Booking Analysis</span></Link>
							</li>
							<li>
							<Link to="/reports/30_day_snapshot"><span className="nav-label">30 Day Snapshot</span></Link>
							</li>
						</ul>
					</li>
					<li>
						<a ui-sref="index.instructions.instructions"><span className="nav-label">Instructional Videos</span></a>
					</li>
					<li>
						<a ui-sref="index.messages.messages"><span className="nav-label">Messages</span></a>
					</li>
					<li>
						<a ui-sref="index.terminals.terminals"><span className="nav-label">Terminals</span></a>
					</li>
				</ul>
			)}
			{props.authenticated && props.user.roles && props.user.roles.includes('sadmin') && (
				<div>
					<ul className="nav metismenu" id="side-menu">
						<li>
							<Link to="/users">
								<span className="nav-label">Users</span>
							</Link>
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}

const mapStateToProps = (state: any) => ({
	authenticated: state.user.authenticated,
	user: state.user.credentials,
})

const mapActionsToProps = {
	logoutUser
}

export default connect(mapStateToProps, mapActionsToProps)(SideMenu)
