import { BrowserRouter, Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import Profile from "./pages/Profile";

// import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route> */}
        </Routes>
    </BrowserRouter>
  );
};

export default App;
