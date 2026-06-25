import Header from "./components/Header";
import Card from "./components/Card";
import Hero from "./components/Hero";
import Blog from "./Screens/Blog";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Screens/LandingPage";
import Login from "./components/Login";
import Register from "./Screens/Registration";
import UserTable from "./Screens/UserTable";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Admin" element={<UserTable />} />
      </Routes>
    </div>
  );
};
export default App;
