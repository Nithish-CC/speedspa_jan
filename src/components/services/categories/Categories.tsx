import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import PageHeader from '../../core/PageHeader'
import { getAllCategory, deleteServiceCategories } from '../../../redux/actions/serviceActions'
import { Link } from 'react-router-dom'
import Pagination from 'react-js-pagination'
import DeleteModal from '../../core/DeleteModal'

const ServiceCategorys = (props: any) => {
    const [errors, setErrors] = useState({} as Error)
    const [title] = useState('Service Categories')
    const [orderBy, setOrderBy] = useState(false)
    const [field, setField] = useState('createdAt')
    const [activePage, setActivePage] = useState(1)
    const [perPage] = useState(10)
    const [buttons] = useState([
        {
            title: 'Add Category',
            url: '/services/categories/add-new'
        }
    ])

    const UI = useSelector((state: any) => state.UI)
    const user = useSelector((state: any) => state.user)
    const allCategories = useSelector((state: any) => state.service.categoryDetails)

    const [modalPopup, setModalPopup] = useState({
        deleteModal: false,
        id: '',
        name: '',
        index: ''
    })
    const [initialModalPopup] = useState({ ...modalPopup })

    useEffect(() => {
        getAllCategory()
        if (UI.errors) {
            setErrors(UI.errors)
        }
    }, [])

    const getAllCategory = () => {
        const params = {
            'businessId': localStorage.businessId,
        }
        props.getAllCategory(params)
    }

    const closeModal = () => {
        setModalPopup(initialModalPopup);
    };

    const deletePopup = (category: any, index: any) => {
        setModalPopup({
            deleteModal: !modalPopup.deleteModal,
            id: category.id,
            name: category.name,
            index: index
        })
    }

    const handleDelete = () => {
        let params = {
            businessId: localStorage.getItem('businessId'),
        };
        props.deleteServiceCategories(modalPopup.id, params);
        closeModal();
        allCategories.splice(modalPopup.index, 1);
    };

    return (
        <React.Fragment>
            {user.authenticated && !UI.loading && (
                <React.Fragment>
                    <PageHeader title={title} buttons={buttons} />
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='wrapper wrapper-content animated fadeInRight'>
                                <div className='ibox float-e-margins'>
                                    <div className='ibox-content table-responsive'>
                                        <br/>
                                        <table className='table table-bordered table-striped table-hover dataTables-example'>
                                            <thead>
                                                <tr>
                                                    <th>Category Name</th>
                                                    <th>Specialist Name</th>
                                                    <th className='text-center'>Seats</th>
                                                    <th className='text-center'>Order</th>
                                                    <th className='text-center'>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allCategories && allCategories.length ? (
                                                    allCategories.slice((activePage - 1) * perPage, activePage * perPage).map((category: any, index: any) => {
                                                        return (
                                                            <tr className='gradeX' key={index}>
                                                                <td>{category.name}</td>
                                                                <td>{category.description}</td>
                                                                <td className='text-center'>{category.seats}</td>
                                                                <td className='text-center'>{category.order}</td>
                                                                <td className='text-center'>
																	<Link style={{'cursor': 'pointer', 'color': '#2a6954'}} key={index} to={`/services/categories/view/${category.id}`}>
																		<i title='View | Edit' className='far fa-edit'></i>
																	</Link>
																	&nbsp; 
																	<a style={{'cursor': 'pointer', 'color': '#2a6954'}}  onClick={() => deletePopup(category, index)}>
																		<i title='Delete' className='far fa-trash-alt'></i>
																	</a>
																</td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className='text-center'>
                                                            No Service Categories
                                                        </td>
                                                    </tr>
                                                )
                                                }
                                            </tbody>
                                        </table>
                                        {allCategories.length > 10 ? (
                                            <div className='text-right'>
                                                <Pagination
                                                    activePage={activePage}
                                                    itemsCountPerPage={perPage}
                                                    totalItemsCount={allCategories.length}
                                                    pageRangeDisplayed={5}
                                                    onChange={(page: any) => setActivePage(page)}
                                                />
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DeleteModal
                            title='Category'
                            modalPopup={modalPopup}
                            closeModal={closeModal}
                            handleDelete={handleDelete}
                        />
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const mapActionsToProps = {
    getAllCategory,
    deleteServiceCategories
}

export default connect(null, mapActionsToProps)(ServiceCategorys)