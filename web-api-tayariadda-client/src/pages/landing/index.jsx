import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Target, TrendingUp, Bell, ArrowRight, Star, CheckCircle } from "lucide-react";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";

function LandingPage() {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.authenticate) {
            if (auth?.user?.role === "instructor") {
                navigate("/instructor");
            } else {
                navigate("/student/home");
            }
        }
    }, [auth, navigate]);

    const features = [
        {
            icon: BookOpen,
            title: "Video Lectures",
            description: "Learn from comprehensive video lectures covering all exam topics"
        },
        {
            icon: Target,
            title: "Mock Tests",
            description: "Practice with our extensive collection of mock tests and quizzes"
        },
        {
            icon: TrendingUp,
            title: "Progress Tracking",
            description: "Monitor your learning journey with detailed analytics and insights"
        },
        {
            icon: Bell,
            title: "Daily Updates",
            description: "Stay updated with the latest exam notifications and syllabus changes"
        }
    ];

    const courses = [
        {
            id: 1,
            title: "Loksewa Level 5 Complete Course",
            image: "/banner-img.png",
            instructor: "Expert Instructor",
            students: "1,234 students",
            rating: 4.8,
            price: "Rs. 2,999"
        },
        {
            id: 2,
            title: "General Knowledge Master Class",
            image: "/banner-img.png",
            instructor: "Senior Faculty",
            students: "987 students",
            rating: 4.9,
            price: "Rs. 1,999"
        },
        {
            id: 3,
            title: "Nepal Language Excellence",
            image: "/banner-img.png",
            instructor: "Language Expert",
            students: "756 students",
            rating: 4.7,
            price: "Rs. 1,499"
        }
    ];

    const testimonials = [
        {
            name: "Rajesh Sharma",
            role: "Level 5 Officer",
            message: "Tayari Adda helped me crack the Loksewa exam on my first attempt. The mock tests were incredibly helpful and gave me real exam experience.",
            avatar: "RS"
        },
        {
            name: "Sita Adhikari",
            role: "Section Officer",
            message: "The video lectures are so clear and well-structured. I could study at my own pace and the progress tracking kept me motivated throughout my preparation.",
            avatar: "SA"
        },
        {
            name: "Bikash Thapa",
            role: "Administrative Officer",
            message: "Best platform for Loksewa preparation! The daily updates and comprehensive study materials made all the difference in my exam success.",
            avatar: "BT"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3">
                            <img
                                src="/tayari-adda-logo.png"
                                alt="Tayari Adda"
                                className="h-10 w-auto"
                            />
                            <span className="text-2xl font-semibold text-gray-900">Tayari Adda</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
                            <Link to="/courses" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Courses</Link>
                            <Link to="/quiz" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">MCQ</Link>
                            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Learning</Link>
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/auth"
                                className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/auth"
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-colors"
                            >
                                Signup
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                                Prepare Smarter for<br />
                                <span className="text-blue-600">Loksewa Exams</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Video lectures, mock tests, and real-time updates all in one platform.
                            </p>
                            <div className="flex gap-4">
                                <Link
                                    to="/courses"
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-semibold border-2 border-gray-300 shadow-md transition-colors">
                                    Watch Demo
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="/student-learning.jpg"
                                alt="Students Learning"
                                className="rounded-2xl shadow-2xl w-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Tayari Adda?</h2>
                        <p className="text-xl text-gray-600">Everything you need to ace your Loksewa exam preparation</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                        <Icon className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Popular Courses */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Courses</h2>
                        <p className="text-xl text-gray-600">Start learning with our top-rated courses</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>{course.instructor}</span>
                                        <span>•</span>
                                        <span>{course.students}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold text-gray-900">{course.rating}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                                    </div>
                                    <Link
                                        to="/courses"
                                        className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg font-semibold shadow-md transition-colors"
                                    >
                                        Enroll Now
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
                        <p className="text-xl text-gray-600">Hear from students who cracked their exams</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 rounded-2xl p-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{testimonial.message}</p>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
                    <h2 className="text-4xl font-bold text-white">Start Your Loksewa Journey Today</h2>
                    <p className="text-xl text-blue-100">Join thousands of successful candidates who trusted Tayari Adda</p>
                    <Link
                        to="/auth"
                        className="inline-block px-10 py-4 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-bold text-lg shadow-xl transition-colors"
                    >
                        Create Account
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-lg">Contact Info</h3>
                            <p>Email: contact@tayariadda.com</p>
                            <p>Phone: +977 1234567890</p>
                            <p>Location: Kathmandu, Nepal</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
                            <div className="flex flex-col gap-2">
                                <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
                                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-lg">Follow Us</h3>
                            <div className="flex gap-4">
                                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center">
                        <p>&copy; 2024 Tayari Adda. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
