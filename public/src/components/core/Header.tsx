import React from 'react'
import { connect } from 'react-redux'
import { logoutUser } from '../../redux/actions/userActions'
import Clock from 'react-live-clock'

const Header = (props: any) => {

	const handleClickLogout = (e: any) => {
		e.preventDefault()
		props.logoutUser()
	}

	return (
		<React.Fragment>
			{props.authenticated && (
				<div className="row border-bottom">
					<nav className="navbar navbar-static-top" role="navigation" style={{ 'marginBottom': '0' }}>
						<div className="navbar-header">
							<a className="navbar-minimalize minimalize-styl-2 btn btn-primary" href="#"><i className="fa fa-bars"></i></a>
						</div>
						<div id="clock" className="clock">
							<Clock format={'dddd, MMMM Do YYYY, hh:mm:ss A'} ticking={true} />
						</div>
						<ul className="nav navbar-top-links navbar-right">
							<li>
								<a onClick={handleClickLogout}>
									<i className="fa fa-sign-out-alt"></i>Log out</a>
							</li>
						</ul>
					</nav>
				</div>
			)}
		</React.Fragment>
	)
}

const mapStateToProps = (state: any) => ({
	authenticated: state.user.authenticated,
	user: state.user,
})

const mapActionsToProps = {
	logoutUser,
}

export default connect(mapStateToProps, mapActionsToProps)(Header)
