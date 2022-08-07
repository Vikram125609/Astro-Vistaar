import * as React from 'react';
import './Signup.css'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    Name: "",
    Email: "",
    Contact: "",
    Password: ""
  });
  let Name;
  let Value;
  const change = (e) => {
    Name = e.target.name;
    Value = e.target.value
    setUser({ ...user, [Name]: [Value] });
  };
  const postData = async (e) => {
    e.preventDefault();
    const { Name, Email, Contact, Password } = user;
    const res = await fetch('http://localhost:5000/api/adduser', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name, Email, Contact, Password
      })
    });
    const data = await res.json();
    // console.log(data);
    if (res.status === 500 || !data) {
      window.alert("Invalid Registration");
    }
    else {
      window.alert("Registered Successfully")
      navigate('/Course');
    }
  }
  return (
    <>
      <Box style={{ margin: "auto", marginTop: "1rem", width: "100%" }}>
        <form method='POST' style={{ margin: "auto", width: "60%", padding: "1rem", boxShadow: "1px 1px 10px 1px black", borderRadius: "8px" }} >
          <Button style={{ width: "100%", padding: "1rem", fontSize: "1rem" }} variant="outlined" color='success' startIcon={<GoogleIcon />}>Sign Up With Google</Button>
          <TextField id="outlined-basic" onChange={change} name="Name" value={user.Name} label="Name" margin='normal' style={{ width: "100%" }} variant="outlined" />
          <TextField id="outlined-basic" onChange={change} name="Email" value={user.Email} label="Email" margin='normal' style={{ width: "100%" }} fullWidth variant="outlined" />
          <TextField id="outlined-basic" onChange={change} name="Contact" value={user.Contact} label="Phone" margin='normal' style={{ width: "100%" }} fullWidth variant="outlined" />
          <TextField id="outlined-basic" onChange={change} name="Password" value={user.Password} label="Password" margin='normal' style={{ width: "100%" }} fullWidth variant="outlined" />
          <Button variant="contained" type='submit' onClick={postData} color="success" style={{ width: "100%", padding: "1rem", fontSize: "1rem", marginTop: "15px" }}>REGISTER</Button>
        </form>
      </Box>
    </>
  );
};
export default Signup;