import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// react-bootstrap
import { Button, Dropdown, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faLock, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// ==============================|| NAV RIGHT ||============================== //

const NavRight = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
    setIsOpen(false); 
  };

  const handleClick = () => {
    navigate('/forgot-pass');
    setIsOpen(false); 
  };

  const handleInviteClick = () => {
    navigate('/user');
    setIsOpen(false); 
  };

  return (
    <div className='mx-5'>
      <Dropdown
        align={'end'}
        className="drp-user"
        show={isOpen} 
        onToggle={() => setIsOpen(!isOpen)}  
      >
        <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
          <i className="feather icon-user fs-6 rounded-circle p-2 text-white" style={{ background: "#3F4D67" }} />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end" className="profile-notification">
          <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
            <ListGroup.Item as="li" className='py-2'>
              <Button className="bg-transparent d-flex gap-3 align-items-center ps-4" onClick={handleClick}>
                <div className='logout-icon ps-1'><FontAwesomeIcon icon={faLock} /></div>
                Change password
              </Button>
            </ListGroup.Item>
            <ListGroup.Item as="li" className='py-2'>
              <Button className="bg-transparent d-flex gap-3 align-items-center ps-4" onClick={handleInviteClick}>
                <div className='logout-icon ps-1'><FontAwesomeIcon icon={faPlus} /></div>
                Invite People
              </Button>
            </ListGroup.Item>
            <ListGroup.Item as="li" className='py-2'>
              <Button className="bg-transparent d-flex gap-3 align-items-center ps-4" onClick={handleLogout}>
                <div className='logout-icon ps-1'><FontAwesomeIcon icon={faArrowRightFromBracket} /></div>
                Logout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default NavRight;
