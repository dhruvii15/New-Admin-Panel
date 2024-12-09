import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Row, Col, Spinner, Table, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from 'components/Card';

const Header = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [id, setId] = useState();
  const [loading, setLoading] = useState(true);
  const [thumbnailFileLabel, setThumbnailFileLabel] = useState('Thumbnail Upload');
  const [codeZipFileLabel, setCodeZipFileLabel] = useState('Code Zip Upload');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleModal = (mode) => {
    if (!visible) {
      if (mode === 'add') {
        setId(undefined);
        setThumbnailFileLabel('Thumbnail Upload');
        setCodeZipFileLabel('Code Zip Upload');
        formik.resetForm();
      }
    } else {
      formik.resetForm();
      setThumbnailFileLabel('Thumbnail Upload');
      setCodeZipFileLabel('Code Zip Upload');
    }
    setVisible(!visible);
  };

  const getData = () => {
    setLoading(true);
    axios.post('http://localhost:5000/api/templates/read', { Category: "header" })
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
      template.Name.toLowerCase().includes(lowercasedTerm) ||

      // Search in Tags
      (template.Tags && template.Tags.some(tag =>
        tag.toLowerCase().includes(lowercasedTerm))) ||

      // Search in Language
      (template.Language && template.Language.some(lang =>
        lang.toLowerCase().includes(lowercasedTerm)))
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    getData();
  }, []);

  const TemplateSchema = Yup.object().shape({
    Name: Yup.string().required('Name is required'),
    Description: Yup.string().required('Description is required'),
    Thumbnail: Yup.mixed().required('Thumbnail is required'),
    Language: Yup.string().required('Language is required'),
    Tags: Yup.string().required('Tags are required'),
    CodeZip: Yup.mixed().required('Code Zip is required'),
  });

  const formik = useFormik({
    initialValues: {
      Name: '',
      Description: '',
      Thumbnail: '',
      Language: '',
      Tags: '',
      CodeZip: '',
    },
    validationSchema: TemplateSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setIsSubmitting(true);
        const formData = new FormData();

        // Append fixed Category
        formData.append('Category', 'header');

        // Append other fields
        formData.append('Name', values.Name);
        formData.append('Description', values.Description);
        formData.append('Thumbnail', values.Thumbnail);
        formData.append('CodeZip', values.CodeZip);

        // Convert Language and Tags to arrays
        const languageArray = values.Language.split(',').map(lang => lang.trim());
        const tagsArray = values.Tags.split(',').map(tag => tag.trim());

        // Append Language and Tags as stringified arrays
        formData.append('Language', JSON.stringify(languageArray));
        formData.append('Tags', JSON.stringify(tagsArray));

        const request = id !== undefined
          ? axios.patch(`http://localhost:5000/api/templates/update/${id}`, formData)
          : axios.post('http://localhost:5000/api/templates/create', formData);

        const res = await request;
        setSubmitting(false);
        resetForm();
        setId(undefined);
        setThumbnailFileLabel('Thumbnail Upload');
        setCodeZipFileLabel('Code Zip Upload');
        getData();
        toast.success(res.data.message);
        toggleModal('add');
      } catch (err) {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <div className='d-sm-flex justify-content-between align-items-center'>
        <div>
          <h4>Header Section </h4>
          <p>Templates / Header</p>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center my-3'>
        {/* Search Input */}
        <InputGroup className="border rounded-2" style={{ width: "35%" }}>
          <Form.Control
            type="text"
            placeholder="Search by Name, Tags, or Language"
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
          + Add New Templates
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
          <Modal.Title className='fs-5 fw-bold text-black'>{id ? "Edit Templates" : "Add New Templates"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>


            {/* CodeZip Upload */}
            <Form.Group className="mb-3">
              <Form.Label className='fw-bold text-black'>{codeZipFileLabel}
                <span className='text-danger ps-2 fw-normal' style={{ fontSize: "17px" }}>* </span>
              </Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="file"
                  id="CodeZip"
                  name="CodeZip"
                  onChange={(event) => {
                    let file = event.currentTarget.files[0];
                    formik.setFieldValue("CodeZip", file);
                    setCodeZipFileLabel(file ? "Code Zip uploaded" : "Code Zip Upload");
                  }}
                  onBlur={formik.handleBlur}
                  label="Choose File"
                  className="d-none no-focus"
                  custom
                />
                <label htmlFor="CodeZip" className="btn mb-0 p-4 bg-white w-100 rounded-2" style={{ border: "1px dotted #c1c1c1" }}>
                  <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ fontSize: "15px" }} />
                  <div style={{ color: "#c1c1c1" }} className='pt-1'>Select Code Zip</div>
                  {formik.values.CodeZip && (
                    <span style={{ fontSize: "0.8rem", color: "#5E95FE" }}>
                      {formik.values.CodeZip.name}
                    </span>
                  )}
                </label>
              </div>
              {formik.errors.CodeZip && formik.touched.CodeZip && (
                <div className="invalid-feedback d-block">
                  {formik.errors.CodeZip}
                </div>
              )}
            </Form.Group>

            {/* Thumbnail Upload */}
            <Form.Group className="mb-3">
              <Form.Label className='fw-bold text-black'>{thumbnailFileLabel}
                <span className='text-danger ps-2 fw-normal' style={{ fontSize: "17px" }}>* </span>
              </Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="file"
                  id="Thumbnail"
                  name="Thumbnail"
                  onChange={(event) => {
                    let file = event.currentTarget.files[0];
                    formik.setFieldValue("Thumbnail", file);
                    setThumbnailFileLabel(file ? "Thumbnail uploaded" : "Thumbnail Upload");
                  }}
                  onBlur={formik.handleBlur}
                  label="Choose File"
                  className="d-none no-focus"
                  custom
                />
                <label htmlFor="Thumbnail" className="btn mb-0 p-4 bg-white w-100 rounded-2" style={{ border: "1px dotted #c1c1c1" }}>
                  <FontAwesomeIcon icon={faArrowUpFromBracket} style={{ fontSize: "15px" }} />
                  <div style={{ color: "#c1c1c1" }} className='pt-1'>Select Thumbnail</div>
                  {formik.values.Thumbnail && (
                    <span style={{ fontSize: "0.8rem", color: "#5E95FE" }}>
                      {formik.values.Thumbnail.name}
                    </span>
                  )}
                </label>
              </div>
              {formik.errors.Thumbnail && formik.touched.Thumbnail && (
                <div className="invalid-feedback d-block">
                  {formik.errors.Thumbnail}
                </div>
              )}
            </Form.Group>

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

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label className='fw-bold text-black'>Description<span className='text-danger ps-2 fw-normal' style={{ fontSize: "17px" }}>* </span></Form.Label>
              <Form.Control
                as="textarea"
                id="Description"
                name="Description"
                className='py-2 no-focus'
                placeholder="Enter Description"
                value={formik.values.Description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.Description && !!formik.errors.Description}
              />
              {formik.errors.Description && formik.touched.Description && (
                <div className="invalid-feedback d-block">
                  {formik.errors.Description}
                </div>
              )}
            </Form.Group>

            {/* Language */}
            <Form.Group className="mb-3">
              <Form.Label className='fw-bold text-black'>Language<span className='text-danger ps-2 fw-normal' style={{ fontSize: "17px" }}>* </span></Form.Label>
              <Form.Control
                type="text"
                id="Language"
                name="Language"
                className='py-2 no-focus'
                placeholder="Enter Languages (comma-separated)"
                value={formik.values.Language}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.Language && !!formik.errors.Language}
              />
              <small className="text-muted">Enter languages separated by commas (e.g., React, Vue, Angular)</small>
              {formik.errors.Language && formik.touched.Language && (
                <div className="invalid-feedback d-block">
                  {formik.errors.Language}
                </div>
              )}
            </Form.Group>

            {/* Tags */}
            <Form.Group className="mb-3">
              <Form.Label className='fw-bold text-black'>Tags<span className='text-danger ps-2 fw-normal' style={{ fontSize: "17px" }}>* </span></Form.Label>
              <Form.Control
                type="text"
                id="Tags"
                name="Tags"
                className='py-2 no-focus'
                placeholder="Enter Tags (comma-separated)"
                value={formik.values.Tags}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.Tags && !!formik.errors.Tags}
              />
              <small className="text-muted">Enter tags separated by commas (e.g. free, premium, responsive)</small>
              {formik.errors.Tags && formik.touched.Tags && (
                <div className="invalid-feedback d-block">
                  {formik.errors.Tags}
                </div>
              )}
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


      <Card data={filteredData} getData={getData}/>

      <ToastContainer />
    </div>
  );
};

export default Header;