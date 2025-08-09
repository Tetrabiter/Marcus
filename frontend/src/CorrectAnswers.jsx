const CorrectAnswers = ({answers}) => {
    if (!answers || answers.length === 0) return null;

    return (
        <div className="bg-lime-100 border-l-4 border-green-500 text-green-900 p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-lg font-semibold mb-2">Your correct answers:</h3>
            <ul className="list-disc pl-5 space-y-1">
                {answers.map((answer, index) => (
                    <li key={index}>{answer}</li>
                ))}
            </ul>
        </div>
    );
};

export default CorrectAnswers;