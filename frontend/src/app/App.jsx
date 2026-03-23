import { Routes, Route } from "react-router-dom";
import StartPage from "../pages/StartPage";
import NotFoundPage from "../pages/404";
import Chat from "../pages/Chat";
import Dashboard from "../pages/Dashboard";
import SetupInterview from "../pages/SetupInterview";
import Review from "../pages/Review";
import Layout from "../components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />}></Route>

      {/* Layout Routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/setup" element={<SetupInterview />}></Route>
        <Route path="/chat" element={<Chat />}></Route>
        <Route path="/review" element={<Review />}></Route>
      </Route>

      <Route path="*" element={<NotFoundPage />}> </Route>
    </Routes>
  )
}

export default App;