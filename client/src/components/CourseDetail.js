import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import Markdown from 'react-markdown'

const CourseDetail = () => {
    // Extracting the 'id' parameter from the URL
    const { id } = useParams();
    // Accessing authentication information from the context
    const { authUser } = useContext(UserContext);
    // State to hold the course details
    const [course, setCourse] = useState();
    // Hook for programmatic navigation
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch course information using the provided 'id'
        const fetchData = async () => {
            try {
                const response = await api(`/courses/${id}`, "GET", "");
                // Check if the response status is 200 (OK)
                if (response.status === 200) {
                    // Parse the response JSON and set the course details in the state
                    const courseDetail = await response.json();
                    setCourse(courseDetail);
                } else if (response.status === 404) {
                    // Navigate to the 'notfound' page if the course is not found
                    navigate('/notfound');
                } else {
                    // If the response status is neither 200 nor 404, throw an error
                    throw new Error();
                }
            } catch (error) {
                // Log any error and navigate to the 'error' page
                console.error(error);
                navigate('/error');
            }
        };
        // Invoke the fetchData function when the 'id' or 'navigate' changes
        fetchData();
    }, [id, navigate]);

    const handleDelete = async (event) => {
        event.preventDefault();
        
        // Send a DELETE request to the API to delete the course
        try {
            const response = await api(`/courses/${id}`, "DELETE", course, authUser);
            // Check if the response status is 204 (No Content)
            if (response.status === 204) {
                console.log("Course was successfully deleted");
                // Navigate to the home page after successful deletion
                navigate("/");
            } else if (response.status === 403) {
                // Navigate to the 'forbidden' page if the user is not authorized
                navigate('/forbidden');
            } else if (response.status === 404) {
                // Navigate to the 'notfound' page if the course is not found
                navigate('/notfound');
            } else {
                // If the response status is none of the above, throw an error
                throw new Error();
            }
        } catch (error) {
            // Log any error and navigate to the 'error' page
            console.error(error);
            navigate('/error');
        }
    };

    return (
        <main>
            <div className="actions--bar">
                <div className="wrap">
                    {
                        // Render buttons based on user authentication and ownership
                        (authUser && (course?.userId === authUser.id))
                            ?
                            // Render buttons for the course owner
                            <>
                                <Link className="button" to="./update">Update Course </Link>
                                <Link className="button" to="/" onClick={handleDelete}>Delete Course </Link>
                                <Link className="button button-secondary" to="/">Return to List </Link>
                            </>
                            // Render a button for non-owners
                            :
                            <Link className="button button-secondary" to="/">Return to List </Link>
                    }
                </div>
            </div>
            <div className="wrap">
                <h2>Course Detail</h2>
                <form>
                    <div className="main--flex">
                        <div>
                            <h3 className="course--detail--title">Course</h3>
                            <h4 className="course--name">{course?.title}</h4>
                            <p>{course?.student.firstName} {course?.student.lastName}</p>
                            <Markdown>{course?.description}</Markdown>
                        </div>
                        <div>
                            <h3 className="course--detail--title">Estimated Time</h3>
                            <p>{course?.estimatedTime}</p>
                            <h3 className="course--detail--title">Materials Needed</h3>
                            <ul className="course--detail--list">
                                <Markdown>{course?.materialsNeeded}</Markdown>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default CourseDetail;
