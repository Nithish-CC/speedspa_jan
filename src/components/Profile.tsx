import PageHeader from './core/PageHeader';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useState } from 'react';
import { StateList } from '../utils/StateList';
import {
    Form,
    Col,
    Row,
    FormControl,
    FormGroup,
    FormLabel
} from 'react-bootstrap';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { classList } from '../utils/common';

const Profile = () => {
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        countryCode: '',
        phoneNumber: '',
        email: '',
        gender: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: ''
        }
    })

    const [password, setPassword] = useState({
        password: '',
        passwordRep: ''
    })

    const [profileSuccess, setProfileSuccess] = useState(false)
    const [passwdSuccess, setPasswdSuccess] = useState(false)

    const userData = useSelector((state: any) => state.user.credentials)

    useEffect(() => {
        setProfile(userData);
        setPassword({
            password: '',
            passwordRep: ''
        })
    }, [userData])

    const handleSubmit = (values: any) => {
        const userId = localStorage.getItem('businessId')
        axios
            .patch(`/users/${userId}`, values)
            .then(res => {
                setProfileSuccess(!profileSuccess)
            })
    };

    const basicFormSchema = yup.object().shape({
        firstName: yup.string().required('First Name is required'),
        lastName: yup.string().required('Last Name is required'),
        countryCode: yup.string().required('Country Code any option'),
        phoneNumber: yup.string().required('Phone Number is required'),
        email: yup.string().email().required('E-Mail is required'),
        gender: yup.string().required('Gender is required'),
        address: yup.object().shape({
            line1: yup.string().required('Line 1 is required'),
            // line2: yup.string().required('Line 2 is required'),
            city: yup.string().required('City is required'),
            state: yup.string().required('State is required'),
            postal_code: yup.string().required('Postal Code is required'),
        }),
    });

    const passwordSchema = yup.object().shape({
        password: yup.string().required('Password is required'),
        passwordRep: yup.string().required('Password is required').oneOf([yup.ref('password'), null], 'Passwords must match'),
    })

    return (
        <div>
            <PageHeader title='Profile' />
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='wrapper wrapper-content animated fadeInRight'>
                        <ul className='nav nav-tabs' id='myTab' role='tablist'>
                            <li className='nav-item active'>
                                <a className='nav-link active show' id='profile-tab' data-toggle='tab' href='#profile' role='tab' aria-controls='profile' aria-selected='false'>Edit Your Info</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' id='passwd-tab' data-toggle='tab' href='#passwd' role='tab' aria-controls='passwd' aria-selected='true'>Change Password</a>
                            </li>
                        </ul>
                        <div className='tab-content' id='myTabContent'>
                            <div className='tab-pane active' id='profile' role='tabpanel' aria-labelledby='profile-tab'>
                                <Formik
                                    initialValues={{ ...profile }}
                                    validationSchema={basicFormSchema}
                                    onSubmit={handleSubmit}
                                    enableReinitialize={true}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting
                                    }) => {
                                        return (
                                            <div className='ibox float-e-margins'>
                                                <div className='ibox-content no-border'>
                                                    <Row className={classList({
                                                        'hide': !profileSuccess,
                                                        'show': profileSuccess
                                                    })}>
                                                        <Col md='8'>
                                                            <div className='text-success m-t-md m-b-md ng-binding'>Thank you! Your data was saved!</div>
                                                        </Col>
                                                    </Row>
                                                    <Form name='staffEdit' className='form-horizontal' noValidate autoComplete='off' onSubmit={handleSubmit}>
                                                        <Row>
                                                            <Col md='8'>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>First Name</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='text'
                                                                            name='firstName'
                                                                            placeholder='Enter First Name'
                                                                            value={values.firstName}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.firstName && touched.firstName}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Last Name</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='text'
                                                                            name='lastName'
                                                                            placeholder='Enter Last Name'
                                                                            value={values.lastName}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.lastName && touched.lastName}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Country Code</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='text'
                                                                            name='countryCode'
                                                                            placeholder='Enter Country Code'
                                                                            value={values.countryCode}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.countryCode && touched.countryCode}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Phone Number</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='text'
                                                                            name='phoneNumber'
                                                                            placeholder='Enter Phone Number'
                                                                            value={values.phoneNumber}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.phoneNumber && touched.phoneNumber}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>

                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>E-Mail</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='email'
                                                                            name='email'
                                                                            placeholder='Enter E-Mail'
                                                                            value={values.email}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.email && touched.email}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Gender</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            as='select'
                                                                            name='gender'
                                                                            value={values.gender}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.gender && touched.gender}
                                                                        >
                                                                            <option value=''>Gender</option>
                                                                            <option selected={values.gender === 'male' ? 'selected' : ''} value='male'>Male</option>
                                                                            <option selected={values.gender === 'female' ? 'selected' : ''} value='female'>Female</option>
                                                                        </FormControl>
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <div className='hr-line-dashed'></div>
                                                        <Row>
                                                            <Col md='8'>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Street Adress 1</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='text'
                                                                            name='address.line1'
                                                                            placeholder='Enter Adress 1'
                                                                            value={values.address.line1}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.address && errors.address.line1 && touched.address && touched.address.line1}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Street Adress 2</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='text'
                                                                            name='address.line2'
                                                                            placeholder='Enter Adress 2'
                                                                            value={values.address.line2}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.address && errors.address.line2 && touched.address && touched.address.line2}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>City</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='text'
                                                                            name='address.city'
                                                                            value={values.address.city}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.address && errors.address.city && touched.address && touched.address.city}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>State</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            as='select'
                                                                            name='address.state'
                                                                            value={values.address.state}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.address && errors.address.state && touched.address && touched.address.state}
                                                                        >
                                                                            <option value=''>State</option>
                                                                            {StateList.map((e) => <option aria-selected={(values.address.state === e.full) ? true : false} selected={(values.address.state === e.full ? true : false)} value={e.short}>{e.full}</option>)}
                                                                        </FormControl>
                                                                    </Col>
                                                                </FormGroup>

                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Zip</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='text'
                                                                            name='address.postal_code'
                                                                            placeholder='Enter Postal Code'
                                                                            value={values.address.postal_code}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.address && errors.address.postal_code && touched.address && touched.address.postal_code}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <div className='hr-line-dashed'></div>
                                                        <div className='row'>
                                                            <div className='col-md-8'>
                                                                <div className='form-group'>
                                                                    <div className='col-sm-9 col-sm-offset-3'>
                                                                        <button className='btn btn-white' type='button'>Cancel</button>&nbsp;
                                                                        <button className='btn btn-primary' type='submit'>Save Changes
                                                                            {/* <i className='fa fa-spinner fa-spin'></i> */}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>
                                        )
                                    }}
                                </Formik>
                            </div>
                            <div className='tab-pane fade' id='passwd' role='tabpanel' aria-labelledby='passwd-tab'>
                                <Formik
                                    initialValues={{ ...password }}
                                    validationSchema={passwordSchema}
                                    onSubmit={(values: any) => {
                                        const userId = localStorage.getItem('userId')
                                        const businessId = localStorage.getItem('businessId')
                                        const data = {
                                            businessId: businessId,
                                            id: userId,
                                            password: values.passwordRep,
                                        }

                                        axios
                                            .patch(`/users/${userId}`, data)
                                            .then(res => {
                                                setPasswdSuccess(!passwdSuccess)
                                            })
                                    }}
                                    enableReinitialize={true}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting
                                    }) => {
                                        return (
                                            <div className='ibox float-e-margins'>
                                                <div className='ibox-content no-border'>
                                                    <Form name='staffEdit' className='form-horizontal' noValidate autoComplete='off' onSubmit={handleSubmit}>
                                                        <Row className={classList({
                                                            'hide': !passwdSuccess,
                                                            'show': passwdSuccess
                                                        })}>
                                                            <Col md='8'>
                                                                <div className='text-success m-t-md m-b-md ng-binding'>
                                                                    Thank you! Your new password was saved!
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col md='8'>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Type New Password</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='password'
                                                                            name='password'
                                                                            placeholder='Type New Password'
                                                                            value={values.password}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.password && touched.password}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md='8'>
                                                                <FormGroup>
                                                                    <FormLabel className='col-sm-3'>Please Repeat</FormLabel>
                                                                    <Col sm='9'>
                                                                        <FormControl
                                                                            type='password'
                                                                            name='passwordRep'
                                                                            placeholder='Please Repeat'
                                                                            value={values.passwordRep}
                                                                            onChange={handleChange}
                                                                            onBlur={handleBlur}
                                                                            isInvalid={errors.passwordRep && touched.passwordRep}
                                                                        />
                                                                    </Col>
                                                                </FormGroup>
                                                            </Col>
                                                        </Row>
                                                        <div className='hr-line-dashed' />
                                                        <div className='row'>
                                                            <div className='col-md-8'>
                                                                <div className='form-group'>
                                                                    <div className='col-sm-9 col-sm-offset-3'>
                                                                        <button className='btn btn-white' type='button'>Cancel</button>&nbsp;
                                                                        <button className='btn btn-primary' type='submit'>Save Changes
                                                                            {/* <i className='fa fa-spinner fa-spin' data-ng-show='vm.savingPass' /> */}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>
                                        )
                                    }}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile