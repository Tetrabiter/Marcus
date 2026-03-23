import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Server, Globe, Cpu, User, CheckCircle2, Layout, Database } from "lucide-react";

const options = {
    stack: [
        { id: "frontend", label: "Frontend", icon: Layout },
        { id: "backend", label: "Backend", icon: Server },
        { id: "fullstack", label: "Fullstack", icon: Globe },
        { id: "mobile", label: "Mobile", icon: Code2 },
    ],
    level: [
        { id: "junior", label: "Junior", icon: User },
        { id: "middle", label: "Middle", icon: CheckCircle2 },
        { id: "senior", label: "Senior", icon: Cpu },
    ],
    type: [
        { id: "algorithms", label: "Algorithms & Data Structures", icon: Code2 },
        { id: "system-design", label: "System Design", icon: Database },
        { id: "behavioral", label: "Behavioral", icon: User },
        { id: "tech-deep-dive", label: "Technical Deep Dive", icon: Cpu },
    ]
};

const SetupInterview = () => {
    const navigate = useNavigate();

    const [config, setConfig] = useState({
        stack: "frontend",
        level: "middle",
        type: "tech-deep-dive"
    });

    const handleSelect = (category: "stack" | "level" | "type", id: string) => {
        setConfig(prev => ({ ...prev, [category]: id }));
    };

    const handleStart = () => {
        navigate('/chat', { state: { interviewConfig: config } });
    };

    const Section = ({ title, category, items }: { title: string, category: "stack" | "level" | "type", items: any[] }) => (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((item) => {
                    const isSelected = config[category] === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleSelect(category, item.id)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${isSelected
                                    ? "bg-blue-600/20 border-blue-500 text-blue-400"
                                    : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600"
                                }`}
                        >
                            <Icon size={24} className={isSelected ? "text-blue-400" : "text-gray-500"} />
                            <span className="font-medium text-sm">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto min-h-[calc(100vh-2rem)] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Configure Your Interview</h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Select your preferred tech stack, seniority level, and interview focus. Marcus will dynamically generate questions based on these parameters.
                </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl space-y-10 shadow-xl mx-auto w-full">
                <Section title="1. Select Role / Stack" category="stack" items={options.stack} />
                <Section title="2. Select Seniority Level" category="level" items={options.level} />
                <Section title="3. Interview Focus" category="type" items={options.type} />

                <div className="pt-6 mt-8 border-t border-gray-800 flex justify-end">
                    <button
                        onClick={handleStart}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Begin Interview Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetupInterview;
