import { faArrowDown, faArrowUpRightFromSquare, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify'; // Ensure you have react-toastify imported

const Card = ({ data, getData }) => { // Added getData prop to allow refreshing data
    const [dropdownVisibleIndex, setDropdownVisibleIndex] = useState(null);
    const dropdownRefs = useRef([]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            dropdownRefs.current.forEach((ref, index) => {
                if (ref && !ref.contains(event.target)) {
                    setDropdownVisibleIndex(null);
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleDownload = (url) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = url.split('/').pop();
        anchor.click();
    };

    const toggleDropdown = (index) => {
        setDropdownVisibleIndex(prevIndex =>
            prevIndex === index ? null : index
        );
    };

    const handleOptionClick = (action, template) => {
        console.log(`${action} clicked for`, template.Name);
        setDropdownVisibleIndex(null); // Hide dropdown after action
    };

    const handleDelete = (templateId) => {
        const email = localStorage.getItem("email");
        if (window.confirm("Are you sure you want to delete this template?")) {
            axios.delete(`http://localhost:5000/api/templates/delete/${templateId}`, {
                data: { email: email }
            })
                .then((res) => {
                    getData();
                    toast.success(res.data.message || "Template deleted successfully");
                })
                .catch((err) => {
                    console.error(err);
                    toast.error(err.response?.data?.message || 'Error deleting template');
                });
        }
    };

    return (
        <div>
            <Row>
                {data && data.length > 0 ? (
                    data.map((templates, index) => (
                        <Col xs={12} lg={6} className="mt-4 px-3" key={index}>
                            <div
                                className="template-container bg-white rounded-3 p-3 shadow position-relative"
                                ref={el => dropdownRefs.current[index] = el}
                            >
                                <div className="image-container position-relative">
                                    <img
                                        src={templates.Thumbnail}
                                        alt="template-thumbnail"
                                        className="w-100 img-fluid rounded-3"
                                        style={{ height: "350px" }}
                                    />
                                    <div className="hover-overlay d-flex justify-content-center align-items-center">
                                        <button
                                            className="btn btn-light me-2"
                                            onClick={() => handleDownload(templates.CodeZip)}
                                        >
                                            <FontAwesomeIcon icon={faArrowDown} className='pe-2 pt-1' />Download
                                        </button>
                                        <button
                                            className="btn btn-light"
                                            onClick={() => window.open(templates.Thumbnail, "_blank")}
                                        >
                                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='pe-2 pt-1' />Preview
                                        </button>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center justify-content-between position-relative'>
                                    <button 
                                        className="tem-name pt-3 text-black fs-6 m-0 text-decoration-underline bg-transparent border-0" 
                                        onClick={() => window.open(templates.Thumbnail, "_blank")}
                                    >
                                        {templates.Name.charAt(0).toUpperCase() + templates.Name.slice(1)}
                                    </button>
                                    <FontAwesomeIcon
                                        icon={faEllipsisVertical}
                                        className='ms-auto fs-6 pt-3 text-black pe-3'
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => toggleDropdown(index)}
                                    />
                                    {dropdownVisibleIndex === index && (
                                        <div
                                            className=""
                                            style={{
                                                position: "absolute",
                                                right: "10px",
                                                top: "40px",
                                                zIndex: 1050,
                                                background: "#fff",
                                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.15)",
                                                borderRadius: "4px",
                                                padding: "5px 10px",
                                            }}
                                        >
                                            <p
                                                className="tem-name dropdown-item text-black m-0 py-1 px-3"
                                                onClick={() => handleOptionClick('Edit Info', templates)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Edit Info
                                            </p>
                                            <p
                                                className="tem-name dropdown-item text-black m-0 py-1 px-3"
                                                onClick={() => handleDelete(templates._id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Delete
                                            </p>
                                            <p
                                                className="tem-name dropdown-item text-black m-0 py-1 px-3"
                                                onClick={() => handleOptionClick('Archive', templates)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Archive
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <p className="pt-3">
                                    {templates.Description.charAt(0).toUpperCase() + templates.Description.slice(1)}
                                </p>
                            </div>
                        </Col>
                    ))
                ) : (
                    <p className="text-center pt-5">No Data Found...</p>
                )}
            </Row>
        </div>
    );
};

export default Card;