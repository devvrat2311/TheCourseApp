import { useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";

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
                                className="section-subheading  ml-6 mt-5"
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
                                    <code className="language-python">
                                        {contentBlock.code}
                                    </code>
                                </pre>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </>
    );
}
