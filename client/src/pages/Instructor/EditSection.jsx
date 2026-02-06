import {
    useParams,
    Link,
    Outlet,
    useOutletContext,
    useLocation,
    useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import Prism from "prismjs";
// import "prism-themes/themes/prism-nord.css";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-cpp";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import ClickyBtn from "../../components/ClickyBtn";
import { CircleDashed, DiamondPlus, Pencil, CheckCircle2 } from "lucide-react";

const QuizQuestionWrapper = ({
    children,
    index,
    content,
    className = "",
    hasEditButton = true,
    navigateFunction,
}) => {
    return (
        <div className={`relative ${className}`}>
            {hasEditButton && (
                <button
                    onClick={() => navigateFunction(index, content)}
                    className="flex gap-1 cursor-pointer p-1 rounded-t-[10px] absolute left-[-0rem] top-[-0.3rem] hover:bg-[var(--bg)] duration-150 transition-colors"
                >
                    <Pencil
                        className="text-[var(--border)] hover:text-[var(--accent)] duration-200 transition-all"
                        size={14}
                    />
                    <p className="text-xs">edit question</p>
                </button>
            )}
            {children}
        </div>
    );
};

const ContentBlockWrapper = ({
    children,
    index,
    type,
    content,
    className = "",
    hasEditButton = true,
    navigateFunction,
}) => {
    return (
        <div className={`relative ${className}`}>
            {hasEditButton && (
                <button
                    onClick={() => navigateFunction(index, type, content)}
                    className="cursor-pointer p-1 rounded-full absolute left-[-0.3rem]"
                >
                    <Pencil
                        className="text-[var(--border)] hover:text-[var(--accent)] duration-200 transition-all"
                        size={16}
                    />
                </button>
            )}
            {children}
        </div>
    );
};

function EditSection() {
    const { courseId, moduleId, sectionId } = useParams();
    const { setCourseTitle, setModuleTitle, setSectionTitle, setLocationURL } =
        useOutletContext();
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState(null);
    const [contentType, setContentType] = useState("");
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

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
                setLocationURL(
                    `/instructor/courses/${courseId}/modules/${moduleId}/edit`,
                );
            } catch (err) {
                console.log(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [
        courseId,
        moduleId,
        sectionId,
        setCourseTitle,
        setModuleTitle,
        setSectionTitle,
        setLocationURL,
        location.pathname,
    ]);

    if (loading) return <p>Loading Section...</p>;
    if (error) return <p>ERROR: {error}</p>;
    if (!content) return <p>No content found for this Section</p>;
    const navigateToCreateQuestion = () => {
        navigate(
            `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit/new-quiz`,
            {
                state: {
                    from: location.pathname,
                },
            },
        );
    };

    const navigateToCreateContentBlock = () => {
        navigate(
            `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit/new-content`,
            {
                state: { from: location.pathname },
            },
        );
    };

    const navigateToEditContentBlock = (index, type, content) => {
        navigate(
            `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit/edit-content?index=${index}&type=${type}`,
            {
                state: {
                    from: location.pathname,
                    content: content,
                },
            },
        );
    };

    const navigateToEditQuizQuestion = (index, content) => {
        navigate(
            `/instructor/courses/${courseId}/modules/${moduleId}/sections/${sectionId}/edit/edit-quiz-question?index=${index}`,
            {
                state: {
                    from: location.pathname,
                    content: content,
                },
            },
        );
    };

    return (
        <>
            <Outlet />
            <div className="flex-1 text-left">
                <div className="flex flex-col rounded p-3 m-2 h-full">
                    {contentType === "normal" ? (
                        <>
                            {content.map((contentBlock, index) => {
                                {
                                    console.log(contentBlock);
                                    switch (contentBlock.type) {
                                        case "heading":
                                            return (
                                                <ContentBlockWrapper
                                                    key={index}
                                                    index={index}
                                                    type={contentBlock.type}
                                                    content={contentBlock.text}
                                                    className="section-heading mt-5"
                                                    navigateFunction={
                                                        navigateToEditContentBlock
                                                    }
                                                >
                                                    <h2
                                                        key={index}
                                                        className="font-bold text-2xl ml-6"
                                                    >
                                                        {contentBlock.text}
                                                    </h2>
                                                </ContentBlockWrapper>
                                            );
                                        case "subheading":
                                            return (
                                                <ContentBlockWrapper
                                                    key={index}
                                                    index={index}
                                                    type={contentBlock.type}
                                                    content={contentBlock.text}
                                                    className="section-subheading mt-4"
                                                    navigateFunction={
                                                        navigateToEditContentBlock
                                                    }
                                                >
                                                    <h2
                                                        key={index}
                                                        className="text-xl text-[var(--accent)] font-bold ml-6"
                                                    >
                                                        {contentBlock.text}
                                                    </h2>
                                                </ContentBlockWrapper>
                                            );
                                        case "paragraph":
                                            return (
                                                <ContentBlockWrapper
                                                    key={index}
                                                    index={index}
                                                    type={contentBlock.type}
                                                    content={contentBlock.text}
                                                    className="mt-2"
                                                    navigateFunction={
                                                        navigateToEditContentBlock
                                                    }
                                                >
                                                    <h2
                                                        key={index}
                                                        className="section-paragraph ml-6"
                                                    >
                                                        {contentBlock.text}
                                                    </h2>
                                                </ContentBlockWrapper>
                                            );
                                        case "bullet":
                                            return (
                                                <ContentBlockWrapper
                                                    key={index}
                                                    index={index}
                                                    type={contentBlock.type}
                                                    content={contentBlock.text}
                                                    className="mt-5"
                                                    navigateFunction={
                                                        navigateToEditContentBlock
                                                    }
                                                >
                                                    <p
                                                        key={index}
                                                        className="section-bullet ml-10 mr-6"
                                                    >
                                                        {contentBlock.text}
                                                    </p>
                                                </ContentBlockWrapper>
                                            );

                                        case "image":
                                            return (
                                                <ContentBlockWrapper
                                                    key={index}
                                                    index={index}
                                                    type={contentBlock.type}
                                                    content={{
                                                        src: contentBlock.src,
                                                        alt: contentBlock.alt,
                                                    }}
                                                    className="mt-5"
                                                    navigateFunction={
                                                        navigateToEditContentBlock
                                                    }
                                                >
                                                    <img
                                                        key={index}
                                                        src={contentBlock.src}
                                                        alt={contentBlock.alt}
                                                        className="section-image"
                                                    />
                                                </ContentBlockWrapper>
                                            );
                                        case "code":
                                            return (
                                                <ContentBlockWrapper
                                                    key={index}
                                                    index={index}
                                                    type={contentBlock.type}
                                                    content={{
                                                        code: contentBlock.code,
                                                        language:
                                                            contentBlock.language,
                                                    }}
                                                    className="mt-5"
                                                    navigateFunction={
                                                        navigateToEditContentBlock
                                                    }
                                                >
                                                    <div
                                                        key={index}
                                                        className="section-code ml-6 mt-5 mr-6 overflow-hidden"
                                                    >
                                                        <pre className="">
                                                            <code
                                                                className={`language-${contentBlock.language}`}
                                                            >
                                                                {
                                                                    contentBlock.code
                                                                }
                                                            </code>
                                                        </pre>
                                                    </div>
                                                </ContentBlockWrapper>
                                            );
                                        case "latex":
                                            return (
                                                <ContentBlockWrapper
                                                    key={index}
                                                    index={index}
                                                    type={contentBlock.type}
                                                    content={contentBlock.text}
                                                    className="mt-5"
                                                    navigateFunction={
                                                        navigateToEditContentBlock
                                                    }
                                                >
                                                    <div
                                                        key={index}
                                                        className="latex-code ml-6 mt-5 mr-6 overflow-x-auto bg-[var(--bg)] p-2"
                                                    >
                                                        <TeX>
                                                            {contentBlock.text}
                                                        </TeX>
                                                    </div>
                                                </ContentBlockWrapper>
                                            );
                                        default:
                                            return null;
                                    }
                                }
                            })}

                            <ClickyBtn
                                clickFunction={() =>
                                    navigateToCreateContentBlock()
                                }
                                stylingClass={
                                    "back-btn gap-2 px-[1rem] py-[0.4rem] items-center ml-1 mt-5"
                                }
                            >
                                <DiamondPlus
                                    className="text-[var(--accent)]"
                                    size={22}
                                />
                                Create New Content Block
                            </ClickyBtn>
                        </>
                    ) : (
                        <>
                            {content.map((question, index) => {
                                return (
                                    <QuizQuestionWrapper
                                        key={index}
                                        index={index}
                                        content={question}
                                        className="mt-5 mb-2"
                                        navigateFunction={
                                            navigateToEditQuizQuestion
                                        }
                                    >
                                        <div
                                            key={index}
                                            className="flex flex-col gap-2 mt-4"
                                        >
                                            <p className="">
                                                Q{index + 1} {question.question}
                                            </p>
                                            {question.options.map(
                                                (option, optionIndex) => {
                                                    return (
                                                        <div
                                                            key={optionIndex}
                                                            className={`flex gap-[10px] justify-center text-xs rounded-xl w-fit p-1 ${option === question.correctAnswer ? "bg-[var(--success-green-lighter)]" : ""}`}
                                                        >
                                                            {option ===
                                                            question.correctAnswer ? (
                                                                <CheckCircle2
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                <CircleDashed
                                                                    size={14}
                                                                />
                                                            )}
                                                            <p className="flex-1">
                                                                {option}
                                                            </p>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </QuizQuestionWrapper>
                                );
                            })}

                            <ClickyBtn
                                clickFunction={() => navigateToCreateQuestion()}
                                stylingClass={
                                    "back-btn gap-1 px-[1rem] py-[0.4rem] items-center ml-1 mt-5 text-xs"
                                }
                            >
                                <DiamondPlus
                                    className="text-[var(--accent)]"
                                    size={22}
                                />
                                Create New Quiz Question
                            </ClickyBtn>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default EditSection;
