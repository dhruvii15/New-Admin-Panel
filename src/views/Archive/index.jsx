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

const Archive = () => {

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const getData = () => {
        setLoading(true);
        axios.post('http://localhost:5000/api/templates/read/archive')
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

    return (
        <>
            <div className='d-sm-flex justify-content-between align-items-center'>
                <div>
                    <h4>Archive System </h4>
                    <p>Setting / Archive</p>
                </div>
            </div>

            {/* Search Input */}
            <InputGroup className="border rounded-2 my-3" style={{ width: "45%" }}>
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

            <Card data={filteredData} getData={getData} />

        </>
    );
};

export default Archive;
