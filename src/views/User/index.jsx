import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Spinner, Table, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const User = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [id, setId] = useState();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [access, setaccess] = useState('viewer');
  const email = localStorage.getItem("email");


  const toggleModal = (mode) => {
    if (!visible) {
      if (mode === 'add') {
        setId(undefined);
        formik.resetForm();
      }
    } else {
      formik.resetForm();
    }
    setVisible(!visible);
  };

  const getData = () => {
    setLoading(true);
    axios.post('http://localhost:5000/api/admin/read')
      .then((res) => {
        const newData = res.data.data.reverse();
        setData(newData);
        setFilteredData(newData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error("Failed to fetch data.");
      });
  };

  // Search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);

    if (!term) {
      setFilteredData(data);
      return;
    }

    const lowercasedTerm = term.toLowerCase();
    const filtered = data.filter(template =>
      // Search in Name
      template.name.toLowerCase().includes(lowercasedTerm) ||
      template.email.toLowerCase().includes(lowercasedTerm) ||
      template.access.toLowerCase().includes(lowercasedTerm)
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    getData();
  }, []);

  const TemplateSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    Email: Yup.string().required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      Name: '',
      Email: ''
    },
    validationSchema: TemplateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setIsSubmitting(true);

        // Prepare the request payload
        const requestData = {
          name: values.Name,
          email: values.Email,
          access: access,
          invite: true,
          emailcheck: email
        };

        const request = id !== undefined
          ? axios.patch(`http://localhost:5000/api/admin/update/${id}`, requestData)
          : axios.post('http://localhost:5000/api/admin/signup', requestData);

        const res = await request;
        resetForm();
        setId(undefined);
        getData();
        toast.success(res.data.message);
        toggleModal('add');
      } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'An error occurred';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });


  const handleEdit = (user) => {
    formik.setValues({
      Name: user.name,
      Email: user.email,
      Access: user.access
    });
    setId(user._id);
    toggleModal('edit');
  };

  const handleDelete = (userId) => {
    console.log(email);
    
    if (window.confirm("Are you sure you want to remove this user?")) {
      axios.delete(`http://localhost:5000/api/admin/delete/${userId}`, {
        data: { email: email }
    })
        .then((res) => {
          getData();
          toast.success(res.data.message);
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response?.data?.message);
        });
    }
  };


  return (
    <div>
      <div className='d-sm-flex justify-content-between align-items-center'>
        <div>
          <h4>Invite People </h4>
          <p>Setting / Users</p>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center my-3'>
        {/* Search Input */}
        <InputGroup className="border rounded-2" style={{ width: "35%" }}>
          <Form.Control
            type="text"
            placeholder="Search by Name, Email & access"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className='border-0 no-focus'
          />
          <InputGroup.Text className='border-0'>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
        </InputGroup>

        {/* Add New Template Button */}
        <Button
          onClick={() => toggleModal('add')}
          className='rounded-3 border-0'
          style={{ backgroundColor: "#3F4D67", color: "white" }}
        >
          + Invite People
        </Button>
      </div>

      <Modal
        show={visible}
        onHide={() => !isSubmitting && toggleModal('add')}
        centered
        backdrop={isSubmitting ? 'static' : true}
        keyboard={!isSubmitting}
      >
        <Modal.Header>
          <Modal.Title className='fs-5 fw-bold text-black'>{id ? "Edit Info" : "Add People"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            {/* Name */}
            <Form.Group className="mb-3">
              <Form.Label className='fw-bold text-black'>Name<span className='text-danger ps-2 fw-normal' style={{ fontSize: "17px" }}>* </span></Form.Label>
              <Form.Control
                type="text"
                id="Name"
                name="Name"
                className='py-2 no-focus'
                placeholder="Enter Name"
                value={formik.values.Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.Name && !!formik.errors.Name}
              />
              {formik.errors.Name && formik.touched.Name && (
                <div className="invalid-feedback d-block">
                  {formik.errors.Name}
                </div>
              )}
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label className='fw-bold text-black'>Email<span className='text-danger ps-2 fw-normal' style={{ fontSize: "17px" }}>* </span></Form.Label>
              <Form.Control
                type="text"
                id="Email"
                name="Email"
                className='py-2 no-focus'
                placeholder="Enter Email"
                value={formik.values.Email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.Email && !!formik.errors.Email}
              />
              {formik.errors.Email && formik.touched.Email && (
                <div className="invalid-feedback d-block">
                  {formik.errors.Email}
                </div>
              )}
            </Form.Group>

            {/* access selection */}
            <Form.Group className="mb-3">
              <Form.Label className='fw-bold text-black'>Permission<span className='text-danger ps-2 fw-normal' style={{ fontSize: "17px" }}>* </span></Form.Label>
              <div>
                {['admin', 'editor', 'viewer'].map((accessOption) => (
                  <Form.Check
                    key={accessOption}
                    type="radio"
                    id={accessOption}
                    label={accessOption.charAt(0).toUpperCase() + accessOption.slice(1)}
                    name="access"
                    checked={access === accessOption}
                    onChange={() => setaccess(accessOption)} // Set the access when the radio button is clicked
                    className="mb-2"
                  />
                ))}
              </div>
            </Form.Group>

            <Row className="mt-2">
              <Col xs={6}>
                <Button
                  variant="secondary"
                  onClick={() => toggleModal()}
                  disabled={isSubmitting}
                  className='w-100 rounded-3 text-black'
                  style={{ background: "#F6F7FB" }}
                >
                  Cancel
                </Button>
              </Col>
              <Col xs={6}>
                <Button
                  type="submit"
                  className='submit border-0 rounded-3 w-100'
                  disabled={isSubmitting}
                  style={{ background: "#3F4D67" }}
                >
                  {isSubmitting ? <Spinner size='sm' /> : 'Submit'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Table striped bordered hover responsive className='text-center fs-6'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Access</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((user, index) => (
              <tr key={user._id} className='p-0'>
                <td className='p-0'>{index + 1}</td>
                <td className='p-0'>{user.name}</td>
                <td className='p-0'>{user.email}</td>
                <td className='p-0'>{user.access}</td>
                <td>
                  <Button className='bg-transparent border-0 fs-5' style={{ color: "#0385C3" }} onClick={() => handleEdit(user)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button className='bg-transparent border-0 text-danger fs-5' onClick={() => handleDelete(user._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">No Data Found</td>
            </tr>
          )}

        </tbody>
      </Table>

      <ToastContainer />
    </div>
  );
};

export default User;
