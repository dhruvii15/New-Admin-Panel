import React from 'react';
import { Col, Row } from 'react-bootstrap';

const Card = ({ data }) => {
  // Function to handle file download
  const handleDownload = (url) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = url.split('/').pop(); // Extract filename from URL
    anchor.click();
  };

  return (
    <div>
      <Row>
        {data && data.length > 0 ? (
          data.map((templates, index) => (
            <Col xs={12} md={6} className="mt-4 px-3" key={index}>
              <div className="template-container bg-white rounded-3 p-3 shadow position-relative">
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
                      Download
                    </button>
                    <button className="btn btn-light">Preview</button>
                  </div>
                </div>
                <p className="pt-3 text-black fs-6 m-0 text-decoration-underline">
                  {templates.Name.charAt(0).toUpperCase() + templates.Name.slice(1)}
                </p>
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
