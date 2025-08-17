import { Routes, Route } from "react-router-dom";
import StartPage from "../StartPage";
import NotFoundPage from "../404";
import Chat from "../Chat";

function App() {
  return(
    <Routes>
        <Route path="/" element={<StartPage/>}></Route>
        <Route path="*" element={<NotFoundPage />}> </Route>
        <Route path="chat" element={<Chat/>}></Route>
    </Routes>
  )
}

export default App;