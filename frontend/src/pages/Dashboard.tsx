import { Link } from "react-router-dom";
import { Play, TrendingUp, Target, Clock, Presentation } from "lucide-react";

const recentInterviews = [
    { id: 1, role: "Frontend Developer (React)", date: "Today", score: 85, duration: "45m" },
    { id: 2, role: "Backend Engineer (Node.js)", date: "Yesterday", score: 92, duration: "50m" },
    { id: 3, role: "System Design", date: "3 days ago", score: 78, duration: "60m" },
];

const statCards = [
    { title: "Total Interviews", value: "12", icon: Presentation, color: "text-blue-400" },
    { title: "Average Score", value: "85%", icon: Target, color: "text-emerald-400" },
    { title: "Time Spent", value: "9.5h", icon: Clock, color: "text-purple-400" },
];

const Dashboard = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Welcome back, Developer
                    </h1>
                    <p className="text-gray-400 mt-2">Here's your interview performance overview</p>
                </div>

                <Link to="/setup">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                        <Play size={20} className="fill-current" />
                        Start New Interview
                    </button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl flex items-center justify-between group hover:bg-gray-800 transition-colors">
                        <div>
                            <p className="text-gray-400 font-medium mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                        </div>
                        <div className={`p-4 rounded-xl bg-gray-900 border border-gray-700 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Interviews */}
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                    <Link to="/review" className="text-sm text-blue-400 hover:text-blue-300 font-medium hidden sm:block">
                        View All History →
                    </Link>
                </div>

                <div className="divide-y divide-gray-700/50">
                    {recentInterviews.map((interview) => (
                        <div key={interview.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-400">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-lg">{interview.role}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{interview.date} • {interview.duration}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${interview.score >= 80 ? 'bg-emerald-400' : 'bg-yellow-400'}`}></div>
                                        <span className="text-white font-bold">{interview.score}/100</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">Score</p>
                                </div>

                                <button className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-colors">
                                    Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;