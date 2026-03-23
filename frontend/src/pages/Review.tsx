import { useLocation, Link } from "react-router-dom";
import { CheckCircle, XCircle, Trophy, Target, ArrowRight } from "lucide-react";

const Review = () => {
    const location = useLocation();
    const messages = location.state?.messages || [];

    // Calculate mock stats based on chat length
    const totalQuestions = Math.max(1, Math.floor(messages.length / 2));
    const score = 85;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Interview Complete</h1>
                <p className="text-gray-400 text-lg">Here is a detailed breakdown of your performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Trophy className="text-yellow-400 mb-4" size={32} />
                    <h3 className="text-3xl font-bold text-white mb-1">{score}/100</h3>
                    <p className="text-gray-400 font-medium">Overall Score</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Target className="text-blue-400 mb-4" size={32} />
                    <h3 className="text-3xl font-bold text-white mb-1">{totalQuestions}</h3>
                    <p className="text-gray-400 font-medium">Questions Answered</p>
                </div>
                <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <CheckCircle className="text-emerald-400 mb-4" size={32} />
                    <h3 className="text-3xl font-bold text-white mb-1">Strong</h3>
                    <p className="text-gray-400 font-medium">Technical Depth</p>
                </div>
            </div>

            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                    <CheckCircle className="text-emerald-400" />
                    Key Strengths
                </h2>
                <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                        <ArrowRight size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                        Demonstrated deep understanding of core Javascript mechanics and React rendering cycle.
                    </li>
                    <li className="flex items-start gap-2">
                        <ArrowRight size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                        Provided clear, step-by-step explanations of complex system designs.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold text-white mt-10 mb-6 flex items-center gap-2">
                    <XCircle className="text-red-400" />
                    Areas to Improve
                </h2>
                <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                        <ArrowRight size={18} className="text-yellow-400 mt-1 flex-shrink-0" />
                        Review time complexities for advanced tree traversal algorithms.
                    </li>
                </ul>
            </div>

            <div className="flex justify-center mt-12">
                <Link to="/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                        Return to Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Review;
