import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";

function EditSection() {
    const { courseId, moduleId, sectionId } = useParams();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [courseTitle, setCourseTitle] = useState("");
    const [moduleTitle, setModuleTitle] = useState("");
    const [sectionTitle, setSectionTitle] = useState("");
    const [contentType, setContentType] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        Prism.highlightAll();
    }, [content]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await api.get(
                    `/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/children`,
                );
                const data = await response.json();
                console.log("content data", data);
                setCourseTitle(data.sectionDetails.courseTitle);
                setModuleTitle(data.sectionDetails.moduleTitle);
                setSectionTitle(data.sectionDetails.sectionTitle);
                setContentType(data.contentType);
                setContent(data.content);
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [courseId, moduleId, sectionId]);

    if (loading) return <p>Loading Sections...</p>;
    if (error) return <p>ERROR: {error}</p>;
    if (!content) return <p>No sections found for this module</p>;

    return (
        <div className="main-content">
            <div className="flex-1 text-left">
                <div className="flex gap-1 items-baseline">
                    <p className="text-[var(--border)] font-bold">
                        {courseTitle}/
                    </p>
                    <p className="text-[var(--border)] font-bold">
                        {moduleTitle}/
                    </p>
                    <p className="text-[var(--accent)] font-bold">
                        {sectionTitle}
                    </p>
                </div>
                <div className="flex flex-col rounded border-2 border-[var(--border)] p-3 m-2 h-full">
                    {contentType === "normal" ? (
                        <>
                            {content.map((contentBlock, index) => {
                                switch (contentBlock.type) {
                                    case "heading":
                                        return (
                                            <h2
                                                key={index}
                                                className="section-heading font-bold text-2xl ml-6 mt-5"
                                            >
                                                {contentBlock.text}
                                            </h2>
                                        );
                                    case "subheading":
                                        return (
                                            <h2
                                                key={index}
                                                className="section-subheading text-xl text-[var(--accent)] font-bold ml-6 mt-5"
                                            >
                                                {contentBlock.text}
                                            </h2>
                                        );
                                    case "paragraph":
                                        return (
                                            <h2
                                                key={index}
                                                className="section-paragraph text-xs ml-6 mt-2"
                                            >
                                                {contentBlock.text}
                                            </h2>
                                        );
                                    case "bullet":
                                        return (
                                            <p
                                                key={index}
                                                className="section-bullet ml-10 mt-5 mr-6"
                                            >
                                                {contentBlock.text}
                                            </p>
                                        );
                                    case "code":
                                        return (
                                            <div
                                                key={index}
                                                className="section-code  ml-6 mt-5 mr-6"
                                            >
                                                <pre className="rounded-2xl border-2 border-[var(--fg-faded)] p-4">
                                                    <code
                                                        className={`language-${contentBlock.language}`}
                                                    >
                                                        {contentBlock.code}
                                                    </code>
                                                </pre>
                                            </div>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                            <button className="border-1 rounded-[5px] mt-2 ml-5 p-0 w-fit">
                                <Link
                                    to={`/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/content/new`}
                                    className="p-4 text-xs"
                                >
                                    Create New Content Block +
                                </Link>
                            </button>
                        </>
                    ) : (
                        <>
                            {content.map((question, index) => {
                                return (
                                    <div key={index}>
                                        <p>
                                            Q{index + 1} {question.question}
                                        </p>
                                        {question.options.map(
                                            (option, optionIndex) => {
                                                return (
                                                    <div
                                                        key={optionIndex}
                                                        className={`rounded w-fit p-1 ${option === question.correctAnswer ? "bg-[var(--success-green)]" : "bg-[var(--bg)]"}`}
                                                    >
                                                        {option}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                );
                            })}
                            <button className="p-0 w-fit">
                                <Link
                                    to={`/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/quiz/new`}
                                    className="border-1 p-1"
                                >
                                    Create New Quiz Question
                                </Link>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditSection;
