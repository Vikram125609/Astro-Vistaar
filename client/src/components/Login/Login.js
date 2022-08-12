import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const redirect = () => {
        navigate("/Signup");
    };
    const login = async (e) => {
        e.preventDefault();
        const res = await fetch('http://localhost:5000/api/Login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,password
            })
        })
        const data = await res.json();
        console.log(data);
        if(res.status === 400 || !data)
        {
            window.alert("please enter your email or password");
        }
        else if(res.status === 404)
        {
            window.alert("Invalid Credentials");
        }
        else
        {
            navigate('/');
        }
    }
    return (
        <>
            <Box style={{ margin: "auto", marginTop: "1rem", width: "100%" }}>
                <form action="" style={{ margin: "auto", marginBottom: "15px", width: "60%", padding: "1rem", boxShadow: "1px 1px 10px 1px black", borderRadius: "8px" }} >
                    <Button style={{ width: "100%", padding: "1rem", fontSize: "1rem" }} variant="outlined" color='success' startIcon={<GoogleIcon />}>Sign Up With Google</Button>
                    <TextField onChange={(e) => { setEmail(e.target.value) }} value={email} id="outlined-basic" name="email" label="Email" margin='normal' style={{ width: "100%" }} fullWidth variant="outlined" />
                    <TextField onChange={(e) => { setPassword(e.target.value) }} value={password} id="outlined-basic" name="password" label="Password" margin='normal' style={{ width: "100%" }} fullWidth variant="outlined" />
                    <Button variant="contained" onClick={login} type='submit' color="success" style={{ width: "100%", padding: "1rem", fontSize: "1rem", marginTop: "15px" }}>Login</Button>
                    <Button onClick={redirect} variant="outlined" color="error" style={{ width: "100%", padding: "1rem", fontSize: "1rem", marginTop: "15px" }}>SIGNUP</Button>
                </form>
            </Box>
        </>
    );
};
export default Login;