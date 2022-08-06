import React, { useState } from 'react'
import { useEffect } from 'react'
import CourseCard from './CourseCard'
const Courses = () => {
  const [data, setData] = useState([])
  const allCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/getallcourse', {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      const data = res.json();
      console.log(data.then((e) => {
        setData(e);
      }));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    allCourses();
  }, [])
  return (
    <div>

      {(data.map((data, id) => {
        return (<CourseCard key={id} Title={data.Title} Description={data.Description} StartDate={data.Start_Date} Status={data.Status} EndDate={data.End_Date} Specialization={data.Specialization}/>)
      }))}
    </div>
  )
}

export default Courses