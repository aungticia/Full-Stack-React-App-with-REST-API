import { useState, useRef, useContext } from "react";
import {  useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import ErrorsDisplay from "./ErrorsDisplay";

const CreateCourse = () => {
    // State to manage validation errors
    const [errors, setErrors] = useState([]);
    // Accessing authentication information from the context
    const { authUser } = useContext(UserContext);
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Refs to store form input values
    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);

    // Event handler for creating a course
    const handleCreate = async (event) => {
        event.preventDefault();

        // Create a course object with information from the form
        const createCourse = {
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
            userId: authUser.id
        }

        // Send a POST request to the API with the course details
        try {
            const response = await api("/courses", "POST", createCourse, authUser);
            // Check if the response status is 201 (Created)
            if (response.status === 201) {
                console.log("Course was successfully created");
                // Navigate to the home page after successful creation
                navigate("/");
            } else if (response.status === 400) {
                // If there are validation errors, set them in the state
                const data = await response.json();
                setErrors(data.errors);
            } else {
                // If the response status is neither 201 nor 400, throw an error
                throw new Error();
            }
        } catch (error) {
            // Log any error and navigate to the 'error' page
            console.error(error);
            navigate('/error');
        }
    }

    // Event handler for cancel button
    const handleCancel = (event) => {
        event.preventDefault();
        // Navigate to the home page
        navigate('/');
    }

    return (
        <main>
            <div className="wrap">
                <h2>Create Course</h2>
                {/* Display validation errors, if any */}
                <ErrorsDisplay errors={errors} />
                <form onSubmit={handleCreate}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input
                                id="courseTitle"
                                name="courseTitle"
                                type="text"
                                ref={title} />
                            {/* Display the name of the authenticated user */}
                            <p>By {authUser.firstName} {authUser.lastName}</p>
                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea
                                id="courseDescription"
                                name="courseDescription"
                                ref={description}
                                defaultValue={""} />
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input
                                id="estimatedTime"
                                name="estimatedTime"
                                type="text"
                                ref={estimatedTime} />
                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea
                                id="materialsNeeded"
                                name="materialsNeeded"
                                ref={materialsNeeded}
                                defaultValue={""} />
                        </div>
                    </div>
                    {/* Submit and cancel buttons */}
                    <button className="button" type="submit">Create Course</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </main>
    );
};

export default CreateCourse;
