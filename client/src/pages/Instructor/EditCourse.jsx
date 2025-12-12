import { useParams } from "react-router-dom";

function EditCourse() {
    const { id } = useParams();
    return (
        <div className="main-content gap-1">
            <p>Hello I am edit Course</p>
            <p> with id: {id}</p>
        </div>
    );
}

export default EditCourse;
