require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Import models
const User = require("../models/User");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Order = require("../models/Order");
const StudentCourses = require("../models/StudentCourses");
const CourseProgress = require("../models/CourseProgress");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tayariadda-server";

// Check if --fresh flag is passed
const isFresh = process.argv.includes("--fresh");

// Seed data
const seedData = async () => {
    try {
        console.log("🌱 Starting seed process...\n");

        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // Clear existing data if --fresh flag is used
        if (isFresh) {
            console.log("🧹 Clearing existing data...");
            await User.deleteMany({});
            await Course.deleteMany({});
            await Quiz.deleteMany({});
            await Question.deleteMany({});
            await Order.deleteMany({});
            await StudentCourses.deleteMany({});
            await CourseProgress.deleteMany({});
            console.log("✅ Existing data cleared\n");
        }

        // ========== 1. SEED USERS ==========
        console.log("👥 Seeding Users...");
        const hashedPassword = await bcrypt.hash("password123", 10);

        // Admin User
        const admin = await User.create({
            fName: "Admin User",
            email: "admin@tayariadda.com",
            password: hashedPassword,
            role: "admin",
            phone: "+977-9841234567",
            image: "https://i.pravatar.cc/150?img=1",
            verified: true,
            verificationToken: null,
        });

        // Instructor Users
        const instructors = await User.insertMany([
            {
                fName: "Dr. Rajesh Kumar",
                email: "rajesh.kumar@tayariadda.com",
                password: hashedPassword,
                role: "instructor",
                phone: "+977-9841234568",
                image: "https://i.pravatar.cc/150?img=12",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Prof. Anita Sharma",
                email: "anita.sharma@tayariadda.com",
                password: hashedPassword,
                role: "instructor",
                phone: "+977-9841234569",
                image: "https://i.pravatar.cc/150?img=5",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Suresh Thapa",
                email: "suresh.thapa@tayariadda.com",
                password: hashedPassword,
                role: "instructor",
                phone: "+977-9841234570",
                image: "https://i.pravatar.cc/150?img=13",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Maya Gurung",
                email: "maya.gurung@tayariadda.com",
                password: hashedPassword,
                role: "instructor",
                phone: "+977-9841234571",
                image: "https://i.pravatar.cc/150?img=9",
                verified: true,
                verificationToken: null,
            },
        ]);

        // Student Users
        const students = await User.insertMany([
            {
                fName: "Arun Shrestha",
                email: "arun.shrestha@test.com",
                password: hashedPassword,
                role: "user",
                phone: "+977-9841234572",
                image: "https://i.pravatar.cc/150?img=33",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Binita Rai",
                email: "binita.rai@test.com",
                password: hashedPassword,
                role: "user",
                phone: "+977-9841234573",
                image: "https://i.pravatar.cc/150?img=44",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Chandan Tamang",
                email: "chandan.tamang@test.com",
                password: hashedPassword,
                role: "user",
                phone: "+977-9841234574",
                image: "https://i.pravatar.cc/150?img=51",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Deepa Karki",
                email: "deepa.karki@test.com",
                password: hashedPassword,
                role: "user",
                phone: "+977-9841234575",
                image: "https://i.pravatar.cc/150?img=20",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Eshwar Poudel",
                email: "eshwar.poudel@test.com",
                password: hashedPassword,
                role: "user",
                phone: "+977-9841234576",
                image: "https://i.pravatar.cc/150?img=60",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Falguni Adhikari",
                email: "falguni.adhikari@test.com",
                password: hashedPassword,
                role: "user",
                phone: "+977-9841234577",
                image: "https://i.pravatar.cc/150?img=23",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Ganesh Magar",
                email: "ganesh.magar@test.com",
                password: hashedPassword,
                role: "user",
                phone: "+977-9841234578",
                image: "https://i.pravatar.cc/150?img=68",
                verified: true,
                verificationToken: null,
            },
            {
                fName: "Hema Basnet",
                email: "hema.basnet@test.com",
                password: hashedPassword,
                role: "user",
                phone: "+977-9841234579",
                image: "https://i.pravatar.cc/150?img=26",
                verified: true,
                verificationToken: null,
            },
        ]);

        console.log(`✅ Created ${1 + instructors.length + students.length} users`);
        console.log(`   - 1 Admin, ${instructors.length} Instructors, ${students.length} Students\n`);

        // ========== 2. SEED COURSES ==========
        console.log("📚 Seeding Courses...");
        const courses = await Course.insertMany([
            {
                instructorId: instructors[0]._id.toString(),
                instructorName: instructors[0].fName,
                date: new Date("2024-01-15"),
                title: "Complete Web Development Bootcamp",
                category: "Web Development",
                level: "Beginner",
                primaryLanguage: "English",
                subtitle: "Learn HTML, CSS, JavaScript, React, Node.js and more",
                description: "A comprehensive web development course covering frontend and backend technologies. Perfect for beginners who want to become full-stack developers.",
                image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
                welcomeMessage: "Welcome to the Complete Web Development Bootcamp! Get ready to build amazing websites.",
                pricing: 4999,
                objectives: "Build responsive websites, Master React and Node.js, Deploy web applications, Understand databases",
                curriculum: [
                    {
                        title: "Introduction to Web Development",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                        public_id: "web_intro_1",
                        freePreview: true,
                    },
                    {
                        title: "HTML Fundamentals",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                        public_id: "html_basics_1",
                        freePreview: true,
                    },
                    {
                        title: "CSS Styling and Layouts",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4",
                        public_id: "css_layouts_1",
                        freePreview: false,
                    },
                    {
                        title: "JavaScript Essentials",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_4mb.mp4",
                        public_id: "js_essentials_1",
                        freePreview: false,
                    },
                    {
                        title: "React Framework Deep Dive",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
                        public_id: "react_deep_1",
                        freePreview: false,
                    },
                ],
                students: [],
                isPublished: true,
            },
            {
                instructorId: instructors[1]._id.toString(),
                instructorName: instructors[1].fName,
                date: new Date("2024-02-01"),
                title: "Data Science with Python",
                category: "Data Science",
                level: "Intermediate",
                primaryLanguage: "English",
                subtitle: "Master data analysis, visualization, and machine learning",
                description: "Learn Python for data science including pandas, numpy, matplotlib, and scikit-learn. Build real-world data science projects.",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
                welcomeMessage: "Welcome to Data Science with Python! Let's unlock insights from data together.",
                pricing: 5999,
                objectives: "Analyze data with pandas, Create visualizations, Build ML models, Work with real datasets",
                curriculum: [
                    {
                        title: "Python for Data Science Introduction",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                        public_id: "python_ds_intro",
                        freePreview: true,
                    },
                    {
                        title: "NumPy and Pandas Basics",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                        public_id: "numpy_pandas",
                        freePreview: false,
                    },
                    {
                        title: "Data Visualization with Matplotlib",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4",
                        public_id: "matplotlib_viz",
                        freePreview: false,
                    },
                    {
                        title: "Machine Learning Fundamentals",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_4mb.mp4",
                        public_id: "ml_fundamentals",
                        freePreview: false,
                    },
                ],
                students: [],
                isPublished: true,
            },
            {
                instructorId: instructors[2]._id.toString(),
                instructorName: instructors[2].fName,
                date: new Date("2024-02-15"),
                title: "UI/UX Design Masterclass",
                category: "Design",
                level: "Beginner",
                primaryLanguage: "English",
                subtitle: "Create beautiful and user-friendly interfaces",
                description: "Master the principles of UI/UX design using Figma. Learn to create wireframes, prototypes, and design systems.",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
                welcomeMessage: "Welcome to UI/UX Design Masterclass! Let's create amazing user experiences.",
                pricing: 3999,
                objectives: "Design with Figma, Create wireframes, Build prototypes, Understand UX principles",
                curriculum: [
                    {
                        title: "Introduction to UI/UX Design",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                        public_id: "uiux_intro",
                        freePreview: true,
                    },
                    {
                        title: "Figma Fundamentals",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                        public_id: "figma_basics",
                        freePreview: false,
                    },
                    {
                        title: "Wireframing and Prototyping",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4",
                        public_id: "wireframe_proto",
                        freePreview: false,
                    },
                ],
                students: [],
                isPublished: true,
            },
            {
                instructorId: instructors[0]._id.toString(),
                instructorName: instructors[0].fName,
                date: new Date("2024-03-01"),
                title: "Advanced JavaScript and TypeScript",
                category: "Web Development",
                level: "Advanced",
                primaryLanguage: "English",
                subtitle: "Deep dive into modern JavaScript and TypeScript",
                description: "Master advanced JavaScript concepts and TypeScript. Learn design patterns, async programming, and type systems.",
                image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800",
                welcomeMessage: "Welcome to Advanced JavaScript! Let's master the language.",
                pricing: 6999,
                objectives: "Master async/await, Understand TypeScript, Learn design patterns, Build scalable applications",
                curriculum: [
                    {
                        title: "Advanced JavaScript Concepts",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                        public_id: "adv_js_concepts",
                        freePreview: true,
                    },
                    {
                        title: "TypeScript Fundamentals",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                        public_id: "ts_fundamentals",
                        freePreview: false,
                    },
                    {
                        title: "Design Patterns in JavaScript",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4",
                        public_id: "js_patterns",
                        freePreview: false,
                    },
                    {
                        title: "Async Programming Mastery",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_4mb.mp4",
                        public_id: "async_mastery",
                        freePreview: false,
                    },
                ],
                students: [],
                isPublished: true,
            },
            {
                instructorId: instructors[3]._id.toString(),
                instructorName: instructors[3].fName,
                date: new Date("2024-03-15"),
                title: "Mobile App Development with React Native",
                category: "Mobile Development",
                level: "Intermediate",
                primaryLanguage: "English",
                subtitle: "Build cross-platform mobile apps",
                description: "Learn to build iOS and Android apps using React Native. Create beautiful, performant mobile applications.",
                image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
                welcomeMessage: "Welcome to React Native! Let's build amazing mobile apps.",
                pricing: 5499,
                objectives: "Build mobile apps, Master React Native, Deploy to app stores, Handle navigation and state",
                curriculum: [
                    {
                        title: "React Native Setup and Basics",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                        public_id: "rn_setup",
                        freePreview: true,
                    },
                    {
                        title: "Components and Styling",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                        public_id: "rn_components",
                        freePreview: false,
                    },
                    {
                        title: "Navigation in React Native",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4",
                        public_id: "rn_navigation",
                        freePreview: false,
                    },
                ],
                students: [],
                isPublished: true,
            },
            {
                instructorId: instructors[1]._id.toString(),
                instructorName: instructors[1].fName,
                date: new Date("2024-04-01"),
                title: "Machine Learning A-Z",
                category: "Data Science",
                level: "Advanced",
                primaryLanguage: "English",
                subtitle: "Complete guide to machine learning algorithms",
                description: "Comprehensive machine learning course covering supervised, unsupervised learning, and deep learning.",
                image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
                welcomeMessage: "Welcome to Machine Learning A-Z! Let's master AI together.",
                pricing: 7999,
                objectives: "Understand ML algorithms, Build predictive models, Master deep learning, Deploy ML models",
                curriculum: [
                    {
                        title: "Introduction to Machine Learning",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                        public_id: "ml_intro",
                        freePreview: true,
                    },
                    {
                        title: "Supervised Learning Algorithms",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                        public_id: "supervised_learning",
                        freePreview: false,
                    },
                    {
                        title: "Unsupervised Learning",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4",
                        public_id: "unsupervised_learning",
                        freePreview: false,
                    },
                    {
                        title: "Deep Learning with Neural Networks",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_4mb.mp4",
                        public_id: "deep_learning",
                        freePreview: false,
                    },
                    {
                        title: "Model Deployment",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
                        public_id: "ml_deployment",
                        freePreview: false,
                    },
                ],
                students: [],
                isPublished: true,
            },
            {
                instructorId: instructors[2]._id.toString(),
                instructorName: instructors[2].fName,
                date: new Date("2024-04-15"),
                title: "Digital Marketing Fundamentals",
                category: "Marketing",
                level: "Beginner",
                primaryLanguage: "English",
                subtitle: "Master online marketing strategies",
                description: "Learn SEO, social media marketing, email marketing, and analytics to grow your business online.",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
                welcomeMessage: "Welcome to Digital Marketing! Let's grow your online presence.",
                pricing: 3499,
                objectives: "Master SEO, Run social media campaigns, Email marketing, Analyze marketing data",
                curriculum: [
                    {
                        title: "Introduction to Digital Marketing",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                        public_id: "digital_marketing_intro",
                        freePreview: true,
                    },
                    {
                        title: "SEO Fundamentals",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                        public_id: "seo_basics",
                        freePreview: false,
                    },
                    {
                        title: "Social Media Marketing",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4",
                        public_id: "social_media_marketing",
                        freePreview: false,
                    },
                ],
                students: [],
                isPublished: true,
            },
            {
                instructorId: instructors[3]._id.toString(),
                instructorName: instructors[3].fName,
                date: new Date("2024-05-01"),
                title: "Cloud Computing with AWS",
                category: "Cloud Computing",
                level: "Intermediate",
                primaryLanguage: "English",
                subtitle: "Master Amazon Web Services",
                description: "Learn AWS services including EC2, S3, Lambda, and more. Prepare for AWS certification.",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
                welcomeMessage: "Welcome to AWS Cloud Computing! Let's master the cloud.",
                pricing: 6499,
                objectives: "Understand AWS services, Deploy applications, Manage cloud infrastructure, Prepare for certification",
                curriculum: [
                    {
                        title: "Introduction to AWS",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                        public_id: "aws_intro",
                        freePreview: true,
                    },
                    {
                        title: "EC2 and Compute Services",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                        public_id: "aws_ec2",
                        freePreview: false,
                    },
                    {
                        title: "S3 and Storage Solutions",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_3mb.mp4",
                        public_id: "aws_s3",
                        freePreview: false,
                    },
                    {
                        title: "Serverless with Lambda",
                        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_4mb.mp4",
                        public_id: "aws_lambda",
                        freePreview: false,
                    },
                ],
                students: [],
                isPublished: false, // Unpublished course
            },
        ]);

        console.log(`✅ Created ${courses.length} courses (${courses.filter(c => c.isPublished).length} published)\n`);

        // ========== 3. SEED QUIZZES ==========
        console.log("📝 Seeding Quizzes...");
        const quizzes = await Quiz.insertMany([
            {
                title: "Web Development Fundamentals Quiz",
                category: "Web Development",
                description: "Test your knowledge of HTML, CSS, and JavaScript basics",
            },
            {
                title: "Data Science Basics Quiz",
                category: "Data Science",
                description: "Quiz on Python, pandas, and data analysis fundamentals",
            },
            {
                title: "UI/UX Design Principles Quiz",
                category: "Design",
                description: "Test your understanding of design principles and best practices",
            },
            {
                title: "JavaScript Advanced Concepts Quiz",
                category: "Web Development",
                description: "Challenge yourself with advanced JavaScript questions",
            },
        ]);

        console.log(`✅ Created ${quizzes.length} quiz sets\n`);

        // ========== 4. SEED QUESTIONS ==========
        console.log("❓ Seeding Questions...");
        const questions = await Question.insertMany([
            // Web Development Fundamentals Quiz
            {
                quizSetId: quizzes[0]._id,
                question: "What does HTML stand for?",
                options: [
                    "Hyper Text Markup Language",
                    "High Tech Modern Language",
                    "Home Tool Markup Language",
                    "Hyperlinks and Text Markup Language",
                ],
                correctAnswer: 0,
            },
            {
                quizSetId: quizzes[0]._id,
                question: "Which CSS property is used to change the text color?",
                options: ["text-color", "font-color", "color", "text-style"],
                correctAnswer: 2,
            },
            {
                quizSetId: quizzes[0]._id,
                question: "What is the correct way to declare a JavaScript variable?",
                options: ["var myVar;", "variable myVar;", "v myVar;", "declare myVar;"],
                correctAnswer: 0,
            },
            {
                quizSetId: quizzes[0]._id,
                question: "Which HTML tag is used to create a hyperlink?",
                options: ["<link>", "<a>", "<href>", "<url>"],
                correctAnswer: 1,
            },
            {
                quizSetId: quizzes[0]._id,
                question: "What does CSS stand for?",
                options: [
                    "Computer Style Sheets",
                    "Cascading Style Sheets",
                    "Creative Style Sheets",
                    "Colorful Style Sheets",
                ],
                correctAnswer: 1,
            },

            // Data Science Basics Quiz
            {
                quizSetId: quizzes[1]._id,
                question: "Which library is primarily used for data manipulation in Python?",
                options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
                correctAnswer: 1,
            },
            {
                quizSetId: quizzes[1]._id,
                question: "What does 'df.head()' do in pandas?",
                options: [
                    "Returns the last 5 rows",
                    "Returns the first 5 rows",
                    "Returns column headers",
                    "Returns data types",
                ],
                correctAnswer: 1,
            },
            {
                quizSetId: quizzes[1]._id,
                question: "Which of the following is a supervised learning algorithm?",
                options: ["K-Means", "Linear Regression", "PCA", "DBSCAN"],
                correctAnswer: 1,
            },
            {
                quizSetId: quizzes[1]._id,
                question: "What is the purpose of train-test split?",
                options: [
                    "To clean the data",
                    "To evaluate model performance",
                    "To visualize data",
                    "To normalize data",
                ],
                correctAnswer: 1,
            },
            {
                quizSetId: quizzes[1]._id,
                question: "Which library is used for creating visualizations in Python?",
                options: ["Pandas", "NumPy", "Matplotlib", "TensorFlow"],
                correctAnswer: 2,
            },

            // UI/UX Design Principles Quiz
            {
                quizSetId: quizzes[2]._id,
                question: "What does UX stand for?",
                options: ["User Experience", "User Execution", "Universal Experience", "Unique Experience"],
                correctAnswer: 0,
            },
            {
                quizSetId: quizzes[2]._id,
                question: "Which tool is commonly used for UI/UX design?",
                options: ["Photoshop", "Figma", "Excel", "Visual Studio"],
                correctAnswer: 1,
            },
            {
                quizSetId: quizzes[2]._id,
                question: "What is a wireframe?",
                options: [
                    "A final design",
                    "A low-fidelity sketch of a design",
                    "A color palette",
                    "A font selection",
                ],
                correctAnswer: 1,
            },
            {
                quizSetId: quizzes[2]._id,
                question: "What is the purpose of a prototype?",
                options: [
                    "To test functionality and user flow",
                    "To write code",
                    "To create content",
                    "To deploy the app",
                ],
                correctAnswer: 0,
            },
            {
                quizSetId: quizzes[2]._id,
                question: "Which principle emphasizes making important elements stand out?",
                options: ["Alignment", "Contrast", "Proximity", "Repetition"],
                correctAnswer: 1,
            },

            // JavaScript Advanced Concepts Quiz
            {
                quizSetId: quizzes[3]._id,
                question: "What is a closure in JavaScript?",
                options: [
                    "A function that has access to its outer function's scope",
                    "A way to close a program",
                    "A type of loop",
                    "A method to end execution",
                ],
                correctAnswer: 0,
            },
            {
                quizSetId: quizzes[3]._id,
                question: "What does 'async/await' do?",
                options: [
                    "Makes code run faster",
                    "Handles asynchronous operations",
                    "Creates animations",
                    "Validates data",
                ],
                correctAnswer: 1,
            },
            {
                quizSetId: quizzes[3]._id,
                question: "What is the purpose of 'this' keyword in JavaScript?",
                options: [
                    "Refers to the current object",
                    "Creates a new variable",
                    "Imports a module",
                    "Defines a constant",
                ],
                correctAnswer: 0,
            },
            {
                quizSetId: quizzes[3]._id,
                question: "What is event bubbling?",
                options: [
                    "Events propagate from child to parent elements",
                    "Events are deleted",
                    "Events are created",
                    "Events are duplicated",
                ],
                correctAnswer: 0,
            },
            {
                quizSetId: quizzes[3]._id,
                question: "What is the difference between '==' and '===' in JavaScript?",
                options: [
                    "No difference",
                    "'===' checks type and value, '==' only checks value",
                    "'==' is faster",
                    "'===' is deprecated",
                ],
                correctAnswer: 1,
            },
        ]);

        console.log(`✅ Created ${questions.length} questions\n`);

        // ========== 5. SEED ORDERS & ENROLLMENTS ==========
        console.log("🛒 Seeding Orders and Enrollments...");

        // Create orders for students enrolling in courses
        const orderData = [
            // Student 0 (Arun) - 3 courses
            {
                student: students[0],
                course: courses[0],
                date: new Date("2024-03-01"),
                paymentStatus: "completed",
                paymentMethod: "PayPal",
            },
            {
                student: students[0],
                course: courses[1],
                date: new Date("2024-03-15"),
                paymentStatus: "completed",
                paymentMethod: "Stripe",
            },
            {
                student: students[0],
                course: courses[2],
                date: new Date("2024-04-01"),
                paymentStatus: "completed",
                paymentMethod: "PayPal",
            },

            // Student 1 (Binita) - 2 courses
            {
                student: students[1],
                course: courses[0],
                date: new Date("2024-03-10"),
                paymentStatus: "completed",
                paymentMethod: "Stripe",
            },
            {
                student: students[1],
                course: courses[3],
                date: new Date("2024-04-05"),
                paymentStatus: "completed",
                paymentMethod: "PayPal",
            },

            // Student 2 (Chandan) - 2 courses
            {
                student: students[2],
                course: courses[1],
                date: new Date("2024-03-20"),
                paymentStatus: "completed",
                paymentMethod: "Stripe",
            },
            {
                student: students[2],
                course: courses[5],
                date: new Date("2024-04-10"),
                paymentStatus: "completed",
                paymentMethod: "PayPal",
            },

            // Student 3 (Deepa) - 1 course
            {
                student: students[3],
                course: courses[2],
                date: new Date("2024-03-25"),
                paymentStatus: "completed",
                paymentMethod: "Stripe",
            },

            // Student 4 (Eshwar) - 2 courses
            {
                student: students[4],
                course: courses[4],
                date: new Date("2024-04-01"),
                paymentStatus: "completed",
                paymentMethod: "PayPal",
            },
            {
                student: students[4],
                course: courses[6],
                date: new Date("2024-04-15"),
                paymentStatus: "completed",
                paymentMethod: "Stripe",
            },

            // Student 5 (Falguni) - 1 course
            {
                student: students[5],
                course: courses[0],
                date: new Date("2024-04-05"),
                paymentStatus: "completed",
                paymentMethod: "PayPal",
            },

            // Student 6 (Ganesh) - 1 course (pending payment)
            {
                student: students[6],
                course: courses[3],
                date: new Date("2024-04-20"),
                paymentStatus: "pending",
                paymentMethod: "PayPal",
            },
        ];

        const orders = [];
        const studentCoursesMap = new Map();

        for (const orderInfo of orderData) {
            const order = await Order.create({
                userId: orderInfo.student._id.toString(),
                fName: orderInfo.student.fName,
                email: orderInfo.student.email,
                orderStatus: orderInfo.paymentStatus === "completed" ? "confirmed" : "pending",
                paymentMethod: orderInfo.paymentMethod,
                paymentStatus: orderInfo.paymentStatus,
                orderDate: orderInfo.date,
                paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
                payerId: orderInfo.student._id.toString(),
                instructorId: orderInfo.course.instructorId,
                instructorName: orderInfo.course.instructorName,
                courseImage: orderInfo.course.image,
                courseTitle: orderInfo.course.title,
                courseId: orderInfo.course._id.toString(),
                coursePricing: orderInfo.course.pricing.toString(),
            });

            orders.push(order);

            // Only create enrollment for completed payments
            if (orderInfo.paymentStatus === "completed") {
                // Update course students array
                await Course.findByIdAndUpdate(orderInfo.course._id, {
                    $push: {
                        students: {
                            studentId: orderInfo.student._id.toString(),
                            studentName: orderInfo.student.fName,
                            studentEmail: orderInfo.student.email,
                            paidAmount: orderInfo.course.pricing.toString(),
                        },
                    },
                });

                // Prepare student courses data
                const studentId = orderInfo.student._id.toString();
                if (!studentCoursesMap.has(studentId)) {
                    studentCoursesMap.set(studentId, []);
                }
                studentCoursesMap.get(studentId).push({
                    courseId: orderInfo.course._id.toString(),
                    title: orderInfo.course.title,
                    instructorId: orderInfo.course.instructorId,
                    instructorName: orderInfo.course.instructorName,
                    dateOfPurchase: orderInfo.date,
                    courseImage: orderInfo.course.image,
                });
            }
        }

        // Create StudentCourses records
        const studentCoursesRecords = [];
        for (const [userId, coursesArray] of studentCoursesMap.entries()) {
            studentCoursesRecords.push({
                userId,
                courses: coursesArray,
            });
        }

        const studentCourses = await StudentCourses.insertMany(studentCoursesRecords);

        console.log(`✅ Created ${orders.length} orders`);
        console.log(`✅ Created ${studentCourses.length} student enrollment records\n`);

        // ========== 6. SEED COURSE PROGRESS ==========
        console.log("📊 Seeding Course Progress...");

        const progressRecords = [];

        // Student 0 (Arun) - Progress in 3 courses
        // Course 0 - 60% complete (3 out of 5 lectures)
        progressRecords.push({
            userId: students[0]._id.toString(),
            courseId: courses[0]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: [
                {
                    lectureId: courses[0].curriculum[0]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-03-02"),
                },
                {
                    lectureId: courses[0].curriculum[1]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-03-03"),
                },
                {
                    lectureId: courses[0].curriculum[2]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-03-05"),
                },
                {
                    lectureId: courses[0].curriculum[3]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
                {
                    lectureId: courses[0].curriculum[4]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
            ],
        });

        // Course 1 - 100% complete
        progressRecords.push({
            userId: students[0]._id.toString(),
            courseId: courses[1]._id.toString(),
            completed: true,
            completionDate: new Date("2024-04-10"),
            lecturesProgress: courses[1].curriculum.map((lecture, index) => ({
                lectureId: lecture._id.toString(),
                viewed: true,
                dateViewed: new Date(new Date("2024-03-16").getTime() + index * 86400000 * 2),
            })),
        });

        // Course 2 - Just started (1 lecture)
        progressRecords.push({
            userId: students[0]._id.toString(),
            courseId: courses[2]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: [
                {
                    lectureId: courses[2].curriculum[0]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-04-02"),
                },
                {
                    lectureId: courses[2].curriculum[1]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
                {
                    lectureId: courses[2].curriculum[2]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
            ],
        });

        // Student 1 (Binita) - Progress in 2 courses
        // Course 0 - 40% complete
        progressRecords.push({
            userId: students[1]._id.toString(),
            courseId: courses[0]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: [
                {
                    lectureId: courses[0].curriculum[0]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-03-11"),
                },
                {
                    lectureId: courses[0].curriculum[1]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-03-12"),
                },
                {
                    lectureId: courses[0].curriculum[2]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
                {
                    lectureId: courses[0].curriculum[3]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
                {
                    lectureId: courses[0].curriculum[4]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
            ],
        });

        // Course 3 - Not started yet
        progressRecords.push({
            userId: students[1]._id.toString(),
            courseId: courses[3]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: courses[3].curriculum.map((lecture) => ({
                lectureId: lecture._id.toString(),
                viewed: false,
                dateViewed: null,
            })),
        });

        // Student 2 (Chandan) - Progress in 2 courses
        // Course 1 - 50% complete
        progressRecords.push({
            userId: students[2]._id.toString(),
            courseId: courses[1]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: [
                {
                    lectureId: courses[1].curriculum[0]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-03-21"),
                },
                {
                    lectureId: courses[1].curriculum[1]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-03-23"),
                },
                {
                    lectureId: courses[1].curriculum[2]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
                {
                    lectureId: courses[1].curriculum[3]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
            ],
        });

        // Course 5 - 100% complete
        progressRecords.push({
            userId: students[2]._id.toString(),
            courseId: courses[5]._id.toString(),
            completed: true,
            completionDate: new Date("2024-05-01"),
            lecturesProgress: courses[5].curriculum.map((lecture, index) => ({
                lectureId: lecture._id.toString(),
                viewed: true,
                dateViewed: new Date(new Date("2024-04-11").getTime() + index * 86400000 * 3),
            })),
        });

        // Student 3 (Deepa) - Progress in 1 course
        progressRecords.push({
            userId: students[3]._id.toString(),
            courseId: courses[2]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: courses[2].curriculum.map((lecture, index) => ({
                lectureId: lecture._id.toString(),
                viewed: index < 2,
                dateViewed: index < 2 ? new Date(new Date("2024-03-26").getTime() + index * 86400000) : null,
            })),
        });

        // Student 4 (Eshwar) - Progress in 2 courses
        progressRecords.push({
            userId: students[4]._id.toString(),
            courseId: courses[4]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: [
                {
                    lectureId: courses[4].curriculum[0]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-04-02"),
                },
                {
                    lectureId: courses[4].curriculum[1]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
                {
                    lectureId: courses[4].curriculum[2]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
            ],
        });

        progressRecords.push({
            userId: students[4]._id.toString(),
            courseId: courses[6]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: courses[6].curriculum.map(() => ({
                lectureId: courses[6].curriculum[0]._id.toString(),
                viewed: false,
                dateViewed: null,
            })),
        });

        // Student 5 (Falguni) - Progress in 1 course
        progressRecords.push({
            userId: students[5]._id.toString(),
            courseId: courses[0]._id.toString(),
            completed: false,
            completionDate: null,
            lecturesProgress: [
                {
                    lectureId: courses[0].curriculum[0]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-04-06"),
                },
                {
                    lectureId: courses[0].curriculum[1]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-04-07"),
                },
                {
                    lectureId: courses[0].curriculum[2]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-04-09"),
                },
                {
                    lectureId: courses[0].curriculum[3]._id.toString(),
                    viewed: true,
                    dateViewed: new Date("2024-04-11"),
                },
                {
                    lectureId: courses[0].curriculum[4]._id.toString(),
                    viewed: false,
                    dateViewed: null,
                },
            ],
        });

        const courseProgress = await CourseProgress.insertMany(progressRecords);

        console.log(`✅ Created ${courseProgress.length} course progress records\n`);

        // ========== SUMMARY ==========
        console.log("=".repeat(50));
        console.log("🎉 SEED DATA SUMMARY");
        console.log("=".repeat(50));
        console.log(`👥 Users: ${1 + instructors.length + students.length}`);
        console.log(`   - Admins: 1`);
        console.log(`   - Instructors: ${instructors.length}`);
        console.log(`   - Students: ${students.length}`);
        console.log(`📚 Courses: ${courses.length} (${courses.filter(c => c.isPublished).length} published)`);
        console.log(`📝 Quizzes: ${quizzes.length}`);
        console.log(`❓ Questions: ${questions.length}`);
        console.log(`🛒 Orders: ${orders.length}`);
        console.log(`📖 Student Enrollments: ${studentCourses.length}`);
        console.log(`📊 Progress Records: ${courseProgress.length}`);
        console.log("=".repeat(50));
        console.log("\n✅ Seed data created successfully!\n");
        console.log("📋 Test Credentials:");
        console.log("   Admin: admin@tayariadda.com / password123");
        console.log("   Instructor: rajesh.kumar@tayariadda.com / password123");
        console.log("   Student: arun.shrestha@test.com / password123");
        console.log("\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding data:", error);
        process.exit(1);
    }
};

// Run the seed function
seedData();
