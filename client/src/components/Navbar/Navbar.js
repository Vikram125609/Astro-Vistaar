import { Link } from 'react-router-dom'
import React from 'react'
import './Navbar.css'
import Button from '@mui/material/Button';
const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className="logo">

            </div>
            <div className='link-container'>
                <Link className='link' to="/">Home</Link>
                <Link className='link' to="/Course">Course</Link>
                <Link className='link' to="Admin/User">All User</Link>
                <Link className='link' to="/Signup">Signup</Link>
                <Link className='link' to="/Login">Login</Link>
                <Button style={{fontSize:"2rem"}} variant="outlined" color="error">Logout</Button>
            </div>
        </nav>
    )
}
export default Navbar