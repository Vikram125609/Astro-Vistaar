import React from 'react'
import './CourseCard.css'
const CourseCard = (props) => {
    const special = props.Specialization
    return (
        <>
            <div className='courseCard'>
                <h1>World Premium Courses</h1>
                <h1>Title : {props.Title}</h1>
                <h1>Description:{props.Description}</h1>
                <h1>Start Date:{props.StartDate}</h1>
                <h1>Status:{props.Status}</h1>
                <h1>End Date:{props.EndDate}</h1>
                {(special.map((data, id) => {
                    
                    return (<div className='specialization' key={id}>
                        <h1>{id}</h1>
                        <h1>{data.Module}</h1>
                        <h1>{data.Title}</h1>
                        <h1>{data.Description}</h1>
                    </div>)
                }))}
            </div>
        </>
    )
}

export default CourseCard;
