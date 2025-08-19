import { useState } from "react";
import { IoSettingsSharp, IoSunny } from 'react-icons/io5';

const Header = () => {
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isDarkMode, setDarkMode] = useState(false);

    return (
        <header>
            <div className="flex justify-between p-4 border-b border-gray-700 text-xl font-semibold">
                <h3>Marcus</h3>
                <div className="flex gap-3">
                    {/* Кнопка настроек */}
                    <button
                        onClick={() => setSettingsOpen(prev => !prev)}
                        className={isSettingsOpen ? "text-blue-500" : ""}
                    >
                        <IoSettingsSharp className="text-2xl" />
                    </button>

                    {/* Кнопка темы */}
                    <button
                        onClick={() => setDarkMode(prev => !prev)}
                        className={isDarkMode ? "text-yellow-400" : ""}
                    >
                        <IoSunny className="text-2xl" />
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
