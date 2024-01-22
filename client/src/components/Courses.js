import { useState, useEffect } from 'react';
import { api } from '../utils/apiHelper';

const Courses = () => {
    // State to hold the list of courses
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch the list of courses from the API when the component mounts
        api('/courses', 'GET', '')
            .then(res => res.json())
            .then(res => setCourses(res));
    }, []); // Empty dependency array ensures the effect runs only once, on mount

    return (
        <main>
            <div className="wrap main--grid">
                {
                    // Map through the courses and render each as a link
                    courses.map(course =>
                        <a className="course--module course--link" key={course.id} href={"./courses/" + course.id}>
                            <h2 className="course--label">Course</h2>
                            <h3 className="course--title">{course.title}</h3>
                        </a>
                    )
                }
                {/* Link to create a new course */}
                <a className="course--module course--add--module" href="./courses/create">
                    <span className="course--add--title">
                        {/* SVG icon for "New Course" */}
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " /></svg>
                        New Course
                    </span>
                </a>
            </div>
        </main>
    );
};

export default Courses;
