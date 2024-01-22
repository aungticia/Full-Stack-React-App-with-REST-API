import { useState, useEffect } from 'react';
import { api } from '../utils/apiHelper';
import { useNavigate } from 'react-router-dom'; 

const Courses = () => {
  const [courses, setCourses] = useState([]);
  // React Router hook for navigation
  const navigate = useNavigate(); 

  useEffect(() => {
    // Function to fetch courses from the API
    const fetchCourses = async () => {
      try {
        // Make a GET request to the '/courses' endpoint
        const response = await api('/courses', 'GET', '');

        // Check if the response status is not OK (e.g., 500 Internal Server Error)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the response JSON data and set it in the state
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        // Log an error message if there's an issue fetching courses
        console.error('Error fetching courses:', error);

        // Redirect to the '/error' path using React Router navigate
        navigate('/error'); // Use navigate to redirect to '/error'
      }
    };

    // Call the fetchCourses function when the component mounts
    fetchCourses();
  }, [navigate]); 

  // Render the main section with a grid layout
  return (
    <main>
      <div className="wrap main--grid">
        {/* Map through the courses and render each as a link */}
        {courses.map((course) => (
          <a className="course--module course--link" key={course.id} href={`./courses/${course.id}`}>
            <h2 className="course--label">Course</h2>
            <h3 className="course--title">{course.title}</h3>
          </a>
        ))}

        {/* Link to create a new course */}
        <a className="course--module course--add--module" href="./courses/create">
          <span className="course--add--title">
            {/* SVG icon for "New Course" */}
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 13 13" className="add">
              <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
            </svg>
            New Course
          </span>
        </a>
      </div>
    </main>
  );
};

export default Courses;
