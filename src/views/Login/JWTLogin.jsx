import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Import icons for show/hide password
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwtDecode  from 'jwt-decode'; // Updated import


const JWTLogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClick = () => {
        navigate('/forgot-pass');
    };
    const handleLoginSuccess = async (response) => {
        // On success, you can retrieve the user's information
        console.log('Login Success:', response);
        const userDetails = jwtDecode(response.credential);
        console.log('User Details:', userDetails);

        // Generate a random password
        const generateRandomPassword = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let password = '';
            for (let i = 0; i < 10; i++) {
                password += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return password;
        };

        const randomPassword = generateRandomPassword();

        try {
            const emailResponse = await axios.post('http://localhost:5000/api/admin/google-login', {
                email: userDetails.email,
                pass: randomPassword
            });
            const { token } = emailResponse.data;
            localStorage.setItem('adminToken', token);
            localStorage.setItem('email', userDetails.email);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error while sending password email:', error);
        }
    };

    const handleLoginError = (error) => {
        console.log('Login Failed:', error);
    };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    pass: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').required('Email is required'),
                    pass: Yup.string().required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setSubmitting }) => {
                    try {
                        setSubmitting(true); // Set submitting to true when submitting starts
                        const response = await axios.post('http://localhost:5000/api/admin/login', {
                            email: values.email,
                            pass: values.pass
                        });

                        const { token } = response.data;
                        localStorage.setItem('adminToken', token);
                        localStorage.setItem('email', values.email);
                        navigate('/dashboard');
                    } catch (error) {
                        console.error(error);
                        setErrors({ submit: 'Invalid email or password' });
                    }
                    setSubmitting(false); // Set submitting to false when submitting completes
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} className='text-start'>
                        <div className="form-group my-3">
                            <input
                                className="form-control"
                                name="email"
                                placeholder='Enter Your Email'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="email"
                                value={values.email}
                                aria-label="Email"
                            />
                            {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
                        </div>
                        <div className="form-group mb-4">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    name="pass"
                                    placeholder='Enter Password'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type={showPassword ? 'text' : 'password'} // Toggle password visibility
                                    value={values.pass}
                                    aria-label="Password"
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                    </button>
                                </div>
                            </div>
                            {touched.pass && errors.pass && <small className="text-danger form-text">{errors.pass}</small>}
                        </div>

                        {errors.submit && (
                            <Col sm={12}>
                                <Alert variant="danger">{errors.submit}</Alert>
                            </Col>
                        )}

                        <Row className="mt-2">
                            <Col className='d-flex'>
                                <Button
                                    className="btn-block mb-4 px-4 border-0 w-50"
                                    disabled={isSubmitting}
                                    size="md"
                                    type="submit"
                                    style={{ background: "#9B8FD4" }}
                                    aria-label="Sign In"
                                >
                                    {isSubmitting ? (
                                        <Spinner animation="border" size="sm" role="status" aria-hidden="true" className="mr-4" />
                                    ) : null}
                                    Sign In
                                </Button>


                                <GoogleOAuthProvider clientId="914762324526-2odovn2fdnc6q1p7cji7chgk7o14h1d8.apps.googleusercontent.com">
                                    <GoogleLogin
                                        onSuccess={handleLoginSuccess}
                                        onError={handleLoginError}
                                    />
                                </GoogleOAuthProvider>
                            </Col>
                        </Row>

                        <p className='text-center m-0' style={{ fontSize: "10px" , cursor:"pointer"  }} onClick={handleClick}>
                            Forgot password?
                        </p>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default JWTLogin;
