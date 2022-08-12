import React from 'react'
import { useEffect, useState } from 'react';
import './UserCard.css';
const UserCard = (props) => {
    const [course, setCourse] = useState([]);
    // "Title":"",
    // "Description":"",
    // "Start_Date":"",
    // "End_Date":""
    const allcourses = async () => {
        // props.Enrolled.forEach(async (element) => {
        for (const element of props.EnrolledCourses) {
            const res = await fetch(`http://localhost:5000/api/getcourse/${element}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            const data = (res.json()).then((e) => {
                // e ek object hai
                console.log(e);
                setCourse(course => [...course, e])
            }).catch((error) => {
                console.log(error);
            })
        }
        // });
    }
    useEffect(() => {
        allcourses();
    }, [])
    console.log(course);
    return (
        <>
            <div className="userCard">
                <h1>Name : {props.Name}</h1>
                <h1>Contact:{props.Contact}</h1>
                <h1>Email:{props.Email}</h1>
                <h1>Password:{props.Password}</h1>
                {
                    course.map((data, id) => {
                        return (<div className='courseDiv' key={id}>
                            <h1>Name : {data.Title}</h1>
                            <h1>Description : {data.Description}</h1>
                            <h1>Status : {data.Status}</h1>
                            {
                                data.Specialization.map((specialData,id)=>{
                                    return (<div className='specialDiv' key={id}>
                                        <h3>Module:{specialData.Module}</h3>
                                        <h3>Title :{specialData.Title}</h3>
                                        <h3>Description:{specialData.Description}</h3>
                                    </div>)
                                })
                            }
                        </div>);
                    })
                }
            </div>
        </>
    )
}

export default UserCard;
