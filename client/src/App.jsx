import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import PrivateRoute from "./components/PrivateRoute";
import ExploreCourses from "./pages/Courses/ExploreCourses";
import CoursePage from "./pages/Courses/CoursePage";
import "./App.css";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <StudentDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/explore"
                        element={
                            <PrivateRoute>
                                <ExploreCourses />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/courses/:id"
                        element={
                            <PrivateRoute>
                                <CoursePage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;
