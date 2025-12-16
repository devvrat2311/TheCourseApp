import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import { ThemeProvider } from "./contexts/ThemeContext";
import { FlashProvider } from "./contexts/FlashContext";
import FlashMessage from "./components/FlashMessage";
import ThemeToggle from "./components/ThemeToggle";

import CourseSectionPage from "./pages/Courses/CourseSectionPage";
import Layout from "./components/Layout";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import PrivateRoute from "./components/PrivateRoute";
import ExploreCourses from "./pages/Courses/ExploreCourses";
import CoursePage from "./pages/Courses/CoursePage";

import InstructorLayout from "./components/InstructorLayout";
import InstructorDashboard from "./pages/Instructor/InstructorDashboard";
import RootRedirect from "./components/RootRedirect";
import CreateCourse from "./pages/Instructor/CreateCourse";
import EditCourse from "./pages/Instructor/EditCourse";
import CreateModule from "./pages/Instructor/CreateModule";
import EditModule from "./pages/Instructor/EditModule";
import CreateSection from "./pages/Instructor/CreateSection";
import EditSection from "./pages/Instructor/EditSection";
import CreateContentBlock from "./pages/Instructor/CreateContentBlock";
import CreateQuizQuestion from "./pages/Instructor/CreateQuizQuestion";

function App() {
    return (
        <>
            <ThemeProvider>
                <FlashProvider>
                    <FlashMessage />
                    <Router>
                        <Routes>
                            <Route path="/" element={<RootRedirect />} />

                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route
                                path="/instructor"
                                element={
                                    <PrivateRoute role={"instructor"}>
                                        <InstructorLayout />
                                        <ThemeToggle />
                                    </PrivateRoute>
                                }
                            >
                                <Route
                                    index
                                    element={<InstructorDashboard />}
                                />
                                <Route
                                    path="courses/new"
                                    element={<CreateCourse />}
                                />
                                <Route
                                    path="courses/:id/edit"
                                    element={<EditCourse />}
                                />
                                <Route
                                    path="courses/:id/modules/new"
                                    element={<CreateModule />}
                                />
                                <Route
                                    path="courses/:courseId/modules/:moduleId/edit"
                                    element={<EditModule />}
                                />
                                <Route
                                    path="courses/:courseId/modules/:moduleId/sections/new"
                                    element={<CreateSection />}
                                />
                                <Route
                                    path="courses/:courseId/modules/:moduleId/sections/:sectionId/edit"
                                    element={<EditSection />}
                                />
                                <Route
                                    path="courses/:courseId/modules/:moduleId/sections/:sectionId/content/new"
                                    element={<CreateContentBlock />}
                                />
                                <Route
                                    path="courses/:courseId/modules/:moduleId/sections/:sectionId/quiz/new"
                                    element={<CreateQuizQuestion />}
                                />
                            </Route>
                            <Route
                                path="/student"
                                // path="/"
                                element={
                                    <PrivateRoute role={"student"}>
                                        <Layout />
                                        <ThemeToggle />
                                    </PrivateRoute>
                                }
                            >
                                <Route index element={<StudentDashboard />} />
                                <Route
                                    path="dashboard"
                                    element={<StudentDashboard />}
                                />

                                <Route
                                    path="explore"
                                    element={<ExploreCourses />}
                                />
                                <Route
                                    path="courses/:courseId"
                                    element={<CoursePage />}
                                />

                                <Route
                                    path="courses/:courseId/:moduleId/sections/:sectionId"
                                    element={<CourseSectionPage />}
                                />
                            </Route>
                            <Route
                                path="*"
                                element={<Navigate to="/" replace />}
                            />
                        </Routes>
                    </Router>
                </FlashProvider>
            </ThemeProvider>
        </>
    );
}

export default App;
