import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import NotVerifiedPage from "./pages/Auth/NotVerifiedPage";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

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
import EditCourseLayout from "./pages/Instructor/EditCourseLayout";

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
                                path="/not-verified"
                                element={<NotVerifiedPage />}
                            />
                            <Route
                                path="/verify-email"
                                element={<VerifyEmail />}
                            />
                            <Route
                                path="/forgot-password"
                                element={<ForgotPasswordPage />}
                            />
                            <Route
                                path="/reset-password"
                                element={<ResetPasswordPage />}
                            />
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
                                    path="courses"
                                    element={<InstructorDashboard />}
                                >
                                    <Route
                                        path="new"
                                        element={<CreateCourse />}
                                    />
                                </Route>
                                <Route
                                    path="courses/:courseId/"
                                    element={<EditCourseLayout />}
                                >
                                    <Route index element={<EditCourse />} />
                                    <Route path="edit" element={<EditCourse />}>
                                        <Route
                                            path="new"
                                            element={<CreateModule />}
                                        />
                                    </Route>
                                    <Route
                                        path="modules/:moduleId/edit"
                                        element={<EditModule />}
                                    >
                                        <Route
                                            path="new"
                                            element={<CreateSection />}
                                        />
                                    </Route>
                                    <Route
                                        path="modules/:moduleId/sections/:sectionId/edit"
                                        element={<EditSection />}
                                    >
                                        <Route
                                            path="new-content"
                                            element={<CreateContentBlock />}
                                        />
                                        <Route
                                            path="new-quiz"
                                            element={<CreateQuizQuestion />}
                                        />
                                    </Route>
                                </Route>
                            </Route>
                            <Route
                                path="/student"
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
