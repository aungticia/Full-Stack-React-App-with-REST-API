import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../utils/apiHelper";
import UserContext from "../context/UserContext";
import Markdown from 'react-markdown'

const CourseDetail = () => {
    const { id } = useParams();
    const { authUser } = useContext(UserContext);
    const [course, setCourse] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        // fetches course information using id 
        const fetchData = async () => {
            const response = await api("/courses/" + id, "GET", "");
            if (response.status === 200) {
                const courseDetail = await response.json();
                setCourse(courseDetail);
            } else if (response.status === 404) {
                navigate('/notfound');
            } else {
                throw new Error();
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleDelete = async (event) => {
        event.preventDefault();
        
        // sends a put request to the api to delete course
        try {
            const response = await api("/courses/" + id, "DELETE", course, authUser);
            if (response.status === 204) {
                console.log("Course was successfully deleted");
                navigate("/");
            } else if (response.status === 403) {
                navigate('/forbidden');
            } else if (response.status === 404) {
                navigate('/notfound');
            }else {
                throw new Error();
            }
        } catch (error) {
            console.log(error);
            navigate('/error');
        }
    };

    return (
        <main>
            <div className="actions--bar">
                <div className="wrap">
                    {
                        (authUser && (course?.userId === authUser.id))
                            ?
                            <>
                                <Link className="button" to="./update">Update Course </Link>
                                <Link className="button" to="/" onClick={handleDelete}>Delete Course </Link>
                                <Link className="button button-secondary" to="/">Return to List </Link>
                            </>
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