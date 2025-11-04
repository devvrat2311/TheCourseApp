import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import PrivateRoute from "./components/PrivateRoute";
import ExploreCourses from "./pages/Courses/ExploreCourses";
import CoursePage from "./pages/Courses/CoursePage";
import "./App.css";
import { FlashProvider } from "./contexts/FlashContext";
import FlashMessage from "./components/FlashMessage";
import ThemeToggle from "./components/ThemeToggle";
import CourseSectionPage from "./pages/Courses/CourseSectionPage";
import Navbar from "./components/Navbar";

function App() {
    return (
        <>
            <FlashProvider>
                <ThemeToggle />
                <FlashMessage />
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route
                            path="/"
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
                        <Route
                            path="/courses/:courseId/:moduleId/sections/:sectionId"
                            element={
                                <PrivateRoute>
                                    <CourseSectionPage />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </FlashProvider>
        </>
    );
}

export default App;
