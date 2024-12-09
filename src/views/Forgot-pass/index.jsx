import React, { useState } from 'react';
import { Button, Card, Col, Row, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb';
import logoDark from '../../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icons

const ForgotPass = () => {
    const [showpass, setShowpass] = useState(false); // State to toggle pass visibility
    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    // Function to toggle pass visibility
    const togglepassVisibility = () => {
        setShowpass(!showpass);
    };

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <React.Fragment>
            <Breadcrumb />
            <div className="auth-wrapper">
                <div className="auth-content">
                    <Card className="borderless text-center">
                        <Card.Body>
                            {/* <img src={logoDark} alt="" className="img-fluid mb-4" width={200}/> */}
                            <img src={logoDark} alt="" className="img-fluid mb-4" />
                            <Formik
                                initialValues={{
                                    email: email,
                                    pass: '',
                                    confirmpass: '',
                                    submit: null
                                }}
                                validationSchema={Yup.object().shape({
                                    email: Yup.string().email('* Must be a valid email').required('* Email is required'),
                                    pass: Yup.string().required('* New pass is required'),
                                    confirmpass: Yup.string().required('* Confirm New pass is required')
                                })}
                                onSubmit={async (values, { setErrors, setSubmitting }) => {
                                    try {
                                        await axios.patch('http://localhost:5000/api/admin/forgetpass', {
                                            email: values.email,
                                            pass: values.pass,
                                            confirmpass: values.confirmpass
                                        });

                                        setSubmitting(false);
                                        navigate('/dashboard'); // Navigate to dashboard after successful pass reset
                                    } catch (error) {
                                        console.error('Request error:', error);

                                        setSubmitting(false);

                                        if (error.response) {
                                            console.error('Server response:', error.response.data);
                                            setErrors({ submit: 'Failed to reset pass. Please check your credentials.' });
                                        } else if (error.request) {
                                            console.error('No response received:', error.request);
                                            setErrors({ submit: 'No response received from server. Please try again later.' });
                                        } else {
                                            console.error('Error setting up request:', error.message);
                                            setErrors({ submit: 'An unexpected error occurred. Please try again.' });
                                        }
                                    }
                                }}
                            >
                                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                    <form noValidate onSubmit={handleSubmit}>
                                        <div className="form-group mb-3 text text-start">
                                            <input
                                                className="form-control"
                                                name="email"
                                                placeholder="Enter Your Email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="email"
                                                value={values.email}
                                            />
                                            {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                                        </div>
                                        <div className="form-group mb-4 position-relative text-start">
                                            <input
                                                className="form-control"
                                                name="pass"
                                                placeholder="Enter New pass"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type={showpass ? 'text' : 'password'} // Toggle between text and password
                                                value={values.pass}
                                            />
                                            <FontAwesomeIcon
                                                icon={showpass ? faEyeSlash : faEye} // Toggle eye icon based on showpass state
                                                className="position-absolute end-0 translate-middle-y px-3 cursor-pointer"
                                                onClick={togglepassVisibility}
                                                style={{ top: "20px" }}
                                            />
                                            {touched.pass && errors.pass && <small className="text-danger form-text">{errors.pass}</small>}
                                        </div>
                                        <div className="form-group mb-4 position-relative text-start">
                                            <input
                                                className="form-control"
                                                name="confirmpass"
                                                placeholder="Confirm New pass"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type={showpass ? 'text' : 'password'} // Toggle between text and password
                                                value={values.confirmpass}
                                            />
                                            <FontAwesomeIcon
                                                icon={showpass ? faEyeSlash : faEye} // Toggle eye icon based on showpass state
                                                className="position-absolute end-0 translate-middle-y px-3 cursor-pointer"
                                                onClick={togglepassVisibility}
                                                style={{ top: "20px" }}
                                            />
                                            {touched.confirmpass && errors.confirmpass && <small className="text-danger form-text">{errors.confirmpass}</small>}
                                        </div>

                                        {errors.submit && (
                                            <Col sm={12}>
                                                <Alert variant="danger">{errors.submit}</Alert>
                                            </Col>
                                        )}

                                        <Row>
                                            <Col mt={2}>
                                                <Button
                                                    className="btn-block mb-4 text-white px-4 border-0"
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    style={{background:"#9B8FD4"}}
                                                >
                                                    Reset password
                                                </Button>
                                            </Col>
                                        </Row>
                                    </form>
                                )}
                            </Formik>

                            <p className='text-center m-0' style={{ fontSize: "10px", cursor:"pointer" }} onClick={handleClick}>
                            Back To Login?
                        </p>

                        </Card.Body>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ForgotPass;
