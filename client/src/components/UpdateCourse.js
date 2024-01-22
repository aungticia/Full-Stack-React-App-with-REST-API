import { useState, useEffect, useRef, useContext} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext"; 
import ErrorsDisplay from "./ErrorsDisplay";

const UpdateCourse = () => {
    const { id } = useParams();
    const [course, setCourse] = useState();
    const { authUser } = useContext(UserContext);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    // state
    const title = useRef(null);
    const description = useRef(null); 
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);

    // fetches the course to update 
    useEffect(() => {
        const fetchData = async () => {
            const response = await api("/courses/" + id, "GET", "");
            if (response.status === 200) {
                const courseDetail = await response.json();
                setCourse(courseDetail);
            } else if (response.status === 403) {
                navigate('/forbidden');
            } else if (response.status === 404) {
                navigate('/notfound');
            } else {
                throw new Error();
            }
        };
        fetchData(); 
    }, [id, navigate]);

    // event handlers 
    const handleUpdate = async (event) => {
        event.preventDefault();

        // creates a new course json for the updated course
        const courseUpdate = {
            title: title.current.value, 
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
            userId: authUser.id
        }

        // sends a put request to the api to update course
        try {
            const response = await api("/courses/" + id, "PUT", courseUpdate, authUser);
            if (response.status === 204) {
                console.log("Course was successfully updated");
                navigate("/courses/" + id); 
            } else if (response.status === 400) {
                const data = await response.json();
                setErrors(data.errors);
            }  else {
                throw new Error(); 
            }
        } catch(error) {
            console.log(error);
            navigate('/error');
        }
    }

    // event listener function for cancel button 
    const handleCancel = (event) => {
        event.preventDefault();
        navigate('/');
    }

    return (
        <main>
            <div className="wrap">
                <h2>Update Course</h2>
                <ErrorsDisplay errors={errors} />
                <form onSubmit={handleUpdate}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input 
                                id="courseTitle" 
                                name="courseTitle" 
                                type="text" 
                                ref={title}
                                defaultValue={course?.title} />
                            <p>{course?.student.firstName} {course?.student.lastName}</p>
                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea 
                                id="courseDescription" 
                                name="courseDescription" 
                                ref={description}
                                defaultValue={course?.description} />
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input 
                                id="estimatedTime" 
                                name="estimatedTime" 
                                type="text" 
                                ref={estimatedTime}
                                defaultValue={course?.estimatedTime} />
                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea 
                                id="materialsNeeded" 
                                name="materialsNeeded" 
                                ref={materialsNeeded}
                                defaultValue={course?.materialsNeeded} />
                        </div>
                    </div>
                    <button className="button" type="submit">Update Course</button><button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </main>
    );
};

export default UpdateCourse;