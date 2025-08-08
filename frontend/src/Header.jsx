import { useState } from "react";
import { IoSend, IoSettingsSharp, IoSunny } from 'react-icons/io5';

const Header = () => {
    
    const [isOpen , setOpen] = useState(false);
    
    return (
        <header>
            <div className="flex justify-between p-4 border-b border-gray-700 text-xl font-semibold">
                <h3>Chat with Marcus</h3>
                <div className="flex gap-3">
                    <button><IoSettingsSharp className="text-2xl" /></button>
                    <button><IoSunny className="text-2xl" /></button>
                </div>
            </div>
        </header>
    )
}

export default Header;