// seedCourses.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/Course");
const User = require("./models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedCourses = async () => {
    await Course.deleteMany(); // clear existing courses

    const courses = [
        {
            title: "Mastering Modern Web Development with React & Node.js",
            description:
                "A comprehensive course to build dynamic and scalable web applications using the MERN stack, focusing on best practices and real-world scenarios.",
            author: "Acme EdTech",
            sections: [
                {
                    title: "Section 1: Frontend Fundamentals with React.js",
                    content:
                        "Dive into React's core concepts: components, JSX, props, and state management. Learn to build interactive user interfaces from the ground up.",
                },
                {
                    title: "Section 2: Advanced React Hooks and Context API",
                    content:
                        "Explore advanced React features like `useEffect`, `useContext`, and custom hooks. Understand how to manage global state efficiently without Redux.",
                },
                {
                    title: "Quiz 1: React.js Essentials",
                    quiz: [
                        {
                            question: "What is JSX in React?",
                            options: [
                                "A JavaScript library for building user interfaces",
                                "A syntax extension for JavaScript that looks like HTML",
                                "A CSS preprocessor",
                                "A database query language",
                            ],
                            correctAnswer:
                                "A syntax extension for JavaScript that looks like HTML",
                        },
                        {
                            question:
                                "Which hook is used for side effects in functional components?",
                            options: [
                                "useState",
                                "useReducer",
                                "useEffect",
                                "useCallback",
                            ],
                            correctAnswer: "useEffect",
                        },
                        {
                            question:
                                "How do you pass data from a parent component to a child component in React?",
                            options: [
                                "Using state",
                                "Using props",
                                "Using context",
                                "Using Redux",
                            ],
                            correctAnswer: "Using props",
                        },
                        {
                            question:
                                "What is the purpose of the `key` prop when rendering lists in React?",
                            options: [
                                "To identify the component's type",
                                "To provide a unique identity to each list item for efficient updates",
                                "To define the component's styling",
                                "To pass data to child components",
                            ],
                            correctAnswer:
                                "To provide a unique identity to each list item for efficient updates",
                        },
                    ],
                },
                {
                    title: "Section 3: Backend with Node.js and Express",
                    content:
                        "Set up robust backend APIs using Node.js and the Express framework. Learn routing, middleware, and handling HTTP requests and responses.",
                },
                {
                    title: "Section 4: Database Integration with MongoDB and Mongoose",
                    content:
                        "Connect your Express application to a MongoDB database. Learn schema design, data modeling with Mongoose, and CRUD operations.",
                },
                {
                    title: "Quiz 2: Node.js & MongoDB Basics",
                    quiz: [
                        {
                            question: "What is Node.js primarily used for?",
                            options: [
                                "Frontend development",
                                "Server-side JavaScript execution",
                                "Database management",
                                "Mobile app development",
                            ],
                            correctAnswer: "Server-side JavaScript execution",
                        },
                        {
                            question:
                                "Which of the following is a key feature of Express.js?",
                            options: [
                                "Client-side rendering",
                                "Middleware functionality",
                                "Direct database access without drivers",
                                "Real-time graphics rendering",
                            ],
                            correctAnswer: "Middleware functionality",
                        },
                        {
                            question:
                                "What is the primary purpose of Mongoose in a Node.js application?",
                            options: [
                                "To manage HTTP requests",
                                "To provide an ODM (Object Data Modeling) for MongoDB",
                                "To handle user authentication",
                                "To compile JavaScript code",
                            ],
                            correctAnswer:
                                "To provide an ODM (Object Data Modeling) for MongoDB",
                        },
                        {
                            question:
                                "Which MongoDB operation is used to add new documents to a collection?",
                            options: ["find", "update", "insert", "delete"],
                            correctAnswer: "insert",
                        },
                    ],
                },
                {
                    title: "Section 5: Connecting Frontend and Backend",
                    content:
                        "Integrate your React frontend with the Node.js backend. Understand data fetching, API calls, and deployment strategies for full-stack applications.",
                },
            ],
        },
        {
            title: "Introduction to Data Science with Python",
            description:
                "An entry-level course covering fundamental concepts in data science, including data manipulation, visualization, and basic machine learning algorithms using Python.",
            author: "Data Insights Academy",
            sections: [
                {
                    title: "Section 1: Python for Data Analysis Refresher",
                    content:
                        "Review essential Python concepts for data science, focusing on data types, control flow, and functions. Introduction to NumPy and Pandas.",
                },
                {
                    title: "Section 2: Data Cleaning and Preprocessing",
                    content:
                        "Learn techniques for handling missing data, outliers, and inconsistent formats. Understand data normalization and scaling for machine learning.",
                },
                {
                    title: "Quiz 1: Data Preparation & Libraries",
                    quiz: [
                        {
                            question:
                                "Which Python library is best suited for numerical operations and array manipulation?",
                            options: [
                                "Pandas",
                                "Matplotlib",
                                "NumPy",
                                "Seaborn",
                            ],
                            correctAnswer: "NumPy",
                        },
                        {
                            question:
                                "What does `NaN` typically represent in a Pandas DataFrame?",
                            options: [
                                "A string value",
                                "A missing or undefined value",
                                "Zero",
                                "A boolean value",
                            ],
                            correctAnswer: "A missing or undefined value",
                        },
                        {
                            question:
                                "Why is data normalization important in some machine learning algorithms?",
                            options: [
                                "To make the data visually appealing",
                                "To speed up database queries",
                                "To ensure features contribute equally to the model's performance",
                                "To encrypt sensitive data",
                            ],
                            correctAnswer:
                                "To ensure features contribute equally to the model's performance",
                        },
                        {
                            question:
                                "Which Pandas function is commonly used to read data from a CSV file?",
                            options: [
                                "pd.write_csv()",
                                "pd.load_csv()",
                                "pd.read_csv()",
                                "pd.get_csv()",
                            ],
                            correctAnswer: "pd.read_csv()",
                        },
                    ],
                },
                {
                    title: "Section 3: Data Visualization with Matplotlib & Seaborn",
                    content:
                        "Create compelling visualizations using Matplotlib and Seaborn. Learn to generate scatter plots, bar charts, histograms, and heatmaps to gain insights from data.",
                },
                {
                    title: "Section 4: Introduction to Machine Learning",
                    content:
                        "Understand the basics of supervised and unsupervised learning. Explore fundamental algorithms like Linear Regression and K-Means Clustering.",
                },
                {
                    title: "Quiz 2: Visualization & ML Fundamentals",
                    quiz: [
                        {
                            question:
                                "Which type of plot is best for visualizing the relationship between two continuous variables?",
                            options: [
                                "Bar chart",
                                "Histogram",
                                "Scatter plot",
                                "Pie chart",
                            ],
                            correctAnswer: "Scatter plot",
                        },
                        {
                            question:
                                "What is the primary goal of supervised machine learning?",
                            options: [
                                "To discover hidden patterns in unlabeled data",
                                "To make predictions based on labeled historical data",
                                "To categorize data without prior knowledge",
                                "To optimize database performance",
                            ],
                            correctAnswer:
                                "To make predictions based on labeled historical data",
                        },
                        {
                            question:
                                "Which of these is an example of a classification problem?",
                            options: [
                                "Predicting house prices",
                                "Grouping similar customers together",
                                "Determining if an email is spam or not",
                                "Forecasting stock market trends",
                            ],
                            correctAnswer:
                                "Determining if an email is spam or not",
                        },
                        {
                            question:
                                "What is the role of a 'feature' in machine learning?",
                            options: [
                                "The output of the model",
                                "An input variable used for prediction",
                                "The algorithm's name",
                                "A type of error",
                            ],
                            correctAnswer:
                                "An input variable used for prediction",
                        },
                    ],
                },
                {
                    title: "Section 5: Model Evaluation and Deployment Concepts",
                    content:
                        "Learn how to evaluate the performance of your machine learning models using metrics like accuracy, precision, and recall. Basic concepts of model deployment.",
                },
            ],
        },
        {
            title: "Cybersecurity Fundamentals: Protecting Digital Assets",
            description:
                "This course provides a solid foundation in cybersecurity principles, threat identification, and defensive strategies to secure information systems and networks.",
            author: "SecureNet Training",
            sections: [
                {
                    title: "Section 1: Core Concepts of Cybersecurity",
                    content:
                        "Understand the CIA triad (Confidentiality, Integrity, Availability), common attack vectors, and the importance of a layered defense strategy.",
                },
                {
                    title: "Section 2: Network Security Essentials",
                    content:
                        "Explore firewalls, intrusion detection/prevention systems (IDS/IPS), VPNs, and secure network protocols like HTTPS and SSL/TLS.",
                },
                {
                    title: "Quiz 1: Cybersecurity Basics",
                    quiz: [
                        {
                            question:
                                "What does 'Confidentiality' mean in the CIA triad?",
                            options: [
                                "Ensuring data is available when needed",
                                "Protecting data from unauthorized access",
                                "Maintaining the accuracy and trustworthiness of data",
                                "The ability to recover from a disaster",
                            ],
                            correctAnswer:
                                "Protecting data from unauthorized access",
                        },
                        {
                            question:
                                "Which of these is a common attack vector?",
                            options: [
                                "Strong password policies",
                                "Regular software updates",
                                "Phishing emails",
                                "Multi-factor authentication",
                            ],
                            correctAnswer: "Phishing emails",
                        },
                        {
                            question:
                                "What is the primary function of a firewall?",
                            options: [
                                "To accelerate internet speed",
                                "To filter network traffic based on security rules",
                                "To encrypt all incoming data",
                                "To store user passwords securely",
                            ],
                            correctAnswer:
                                "To filter network traffic based on security rules",
                        },
                        {
                            question:
                                "HTTPS uses which protocol for secure communication?",
                            options: ["FTP", "SMTP", "TCP", "SSL/TLS"],
                            correctAnswer: "SSL/TLS",
                        },
                    ],
                },
                {
                    title: "Section 3: Malware and Social Engineering",
                    content:
                        "Identify different types of malware (viruses, worms, ransomware) and understand social engineering tactics used by attackers to manipulate individuals.",
                },
                {
                    title: "Section 4: Cryptography and Data Encryption",
                    content:
                        "Learn the basics of symmetric and asymmetric encryption, hashing, and digital signatures. Understand their role in securing data at rest and in transit.",
                },
                {
                    title: "Quiz 2: Threats & Defenses",
                    quiz: [
                        {
                            question:
                                "What type of malware encrypts a victim's files and demands payment?",
                            options: ["Virus", "Worm", "Trojan", "Ransomware"],
                            correctAnswer: "Ransomware",
                        },
                        {
                            question:
                                "Which of these is a common social engineering technique?",
                            options: [
                                "Patching software vulnerabilities",
                                "Installing antivirus software",
                                "Pretexting (creating a fake scenario to gain information)",
                                "Using a strong password",
                            ],
                            correctAnswer:
                                "Pretexting (creating a fake scenario to gain information)",
                        },
                        {
                            question:
                                "What is the main difference between symmetric and asymmetric encryption?",
                            options: [
                                "Symmetric uses one key, asymmetric uses two keys (public/private)",
                                "Symmetric is faster, asymmetric is slower",
                                "Symmetric is for text, asymmetric is for images",
                                "Symmetric is less secure, asymmetric is more secure",
                            ],
                            correctAnswer:
                                "Symmetric uses one key, asymmetric uses two keys (public/private)",
                        },
                        {
                            question:
                                "What is the purpose of a 'hash function' in cybersecurity?",
                            options: [
                                "To decrypt encrypted data",
                                "To create a fixed-size, unique representation of data for integrity checks",
                                "To compress data for storage",
                                "To generate random numbers",
                            ],
                            correctAnswer:
                                "To create a fixed-size, unique representation of data for integrity checks",
                        },
                    ],
                },
            ],
        },
    ];

    try {
        await Course.insertMany(courses);
        console.log("Courses seeded successfully.");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        mongoose.connection.close();
    }
};

seedCourses();
