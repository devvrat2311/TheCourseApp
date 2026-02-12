import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-cpp";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

export default function SectionContent({ sectionData }) {
    useEffect(() => {
        Prism.highlightAll();
    }, [sectionData]);

    return (
        <>
            {sectionData.content.map((contentBlock, index) => {
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
                                className="section-paragraph ml-6 mt-5"
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

                    case "latex":
                        return (
                            <div
                                key={index}
                                className="latex-code ml-6 mt-5 mr-6"
                            >
                                <TeX>{contentBlock.text}</TeX>
                            </div>
                        );
                    case "image":
                        return (
                            <img
                                key={index}
                                src={contentBlock.src}
                                alt={contentBlock.alt}
                                className="section-image ml-5"
                            />
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}
