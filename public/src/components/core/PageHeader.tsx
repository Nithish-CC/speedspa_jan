import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const PageHeader = (props: any) => {
	return (
		<React.Fragment>
			{props.authenticated && (
                <div>
                <div className="row wrapper border-bottom white-bg page-heading" style={{'padding': '10px'}}>
                    <div className="col-sm-12">
                        <div className="col-sm-9">
                            <h2 style={{'margin': '10px 0'}}>
                                {props.title}
                                {/* Welcome,  */}
                                {/* {props.businessDetails.businessName} */}
                            </h2>
                        </div>
                        <div className="col-sm-3 title-action" style={{'padding':'10px 0'}}>
                            {props.buttons && props.buttons.length ? (
                                props.buttons.map((button: any, index:any) => {
                                    return (
                                        <Link key={index} to={button.url} className="btn btn-sm btn-primary" style={{'marginRight': '5px'}}>
                                            {button.title}
                                        </Link>

                                    );
                                })
                            ) : 
                            <></>
                            }
                        </div>
                    </div>
                </div>
                </div>
			)}
		</React.Fragment>
	)
}

const mapStateToProps = (state: any) => ({
	authenticated: state.user.authenticated,
	businessDetails: state.user.businessDetails,
})

export default connect(mapStateToProps, null)(PageHeader)
