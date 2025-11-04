export default function QuizContent({ sectionData }) {
    return (
        <div className="ml-6">
            {sectionData.quiz.map((quizQuestion, index) => (
                <div
                    className="border-2 border-[var(--shadow)] mr-6 mb-5"
                    key={index}
                >
                    <p>{quizQuestion.question}</p>
                    {quizQuestion.options.map((option, index) => (
                        <p key={index}>{option}</p>
                    ))}
                </div>
            ))}
        </div>
    );
}
