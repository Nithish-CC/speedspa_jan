import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { connect } from 'react-redux'
import Header from '../components/core/Header'
import Spinner from '../components/Spinner'
import SideMenu from '../components/core/SideMenu'

interface MyRouteProps extends RouteProps {
	component: any
	authenticated: boolean
	rest?: any
}

const PrivateRoute: React.FunctionComponent<MyRouteProps> = ({ component: Component, authenticated, loading, ...rest }: any) => (
	<Route {...rest} render={(props) => (localStorage.token ? (
		<div id="wrapper">
			<nav className="navbar-default navbar-static-side" role="navigation">
				<div className="sidebar-collapse">
					<SideMenu />
				</div>
			</nav>
			<div id="page-wrapper" className="gray-bg">
				<Header />
				<Spinner />
				<div id="page-content">
					<Component {...props} />
				</div>
			</div>
		</div>
	) : <Redirect to='/' />)} />
)

const mapStateToProps = (state: any) => ({
	authenticated: state.user.authenticated,
	loading: state.UI.loading
})

export default connect(mapStateToProps)(PrivateRoute)
