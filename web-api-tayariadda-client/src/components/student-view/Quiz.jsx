import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/auth-context";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// List of study and quiz-related icons
const quizIcons = ["📖", "📝", "📚", "🔎", "❓", "✅", "🎓", "🏆", "💡", "📋", "✏️", "🧠", "🎯", "📜", "📊"];

const QuizList = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizIconsMap, setQuizIconsMap] = useState({});
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Seed quiz data
  const seedQuizzes = [
    {
      _id: "seed-quiz-1",
      title: "Loksewa General Knowledge - Part 1",
      category: "General Knowledge",
      isNew: true,
    },
    {
      _id: "seed-quiz-2",
      title: "Nepal Constitution & Governance",
      category: "Constitution",
      isNew: false,
    },
    {
      _id: "seed-quiz-3",
      title: "Current Affairs 2024",
      category: "Current Affairs",
      isNew: true,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Quizzes
        const quizResponse = await axios.get("http://localhost:5000/instructor/quiz");
        let quizzes = [];
        if (quizResponse.data.success && quizResponse.data.data.length > 0) {
          quizzes = quizResponse.data.data;
        } else {
          quizzes = seedQuizzes;
        }

        setQuizSets(quizzes);

        // Assign icons
        const iconsMap = {};
        quizzes.forEach((quiz, index) => {
          iconsMap[quiz._id] = quizIcons[index % quizIcons.length];
        });
        setQuizIconsMap(iconsMap);

        // Fetch User Results if logged in
        if (auth?.user?._id) {
          try {
            const resultsResponse = await axios.get(`http://localhost:5000/student/quiz/results/${auth.user._id}`);
            if (resultsResponse.data.success) {
              // Convert array to map for easier lookup: { quizId: resultObject }
              const resultsMap = {};
              resultsResponse.data.data.forEach(result => {
                // Determine best result if multiple? For now just take the latest or overwrite
                resultsMap[result.quizId] = result;
              });
              setQuizResults(resultsMap);
            }
          } catch (err) {
            console.error("Error fetching results", err);
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setQuizSets(seedQuizzes);
        const iconsMap = {};
        seedQuizzes.forEach((quiz, index) => {
          iconsMap[quiz._id] = quizIcons[index % quizIcons.length];
        });
        setQuizIconsMap(iconsMap);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth?.user?._id]);

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDialogOpen(true);
  };

  const handleStartQuiz = () => {
    if (selectedQuiz) {
      navigate(`/student/quiz/${selectedQuiz._id}`);
      setIsDialogOpen(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 text-lg">Loading quizzes...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10 font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Available Quizzes
          </h1>
          <p className="text-gray-600 text-lg">
            Test your knowledge and sharpen your skills with our curated quizzes.
          </p>
        </div>

        {quizSets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <span className="text-6xl mb-4">📭</span>
            <p className="text-xl text-gray-500 font-medium">No quizzes available at the moment.</p>
            <p className="text-gray-400">Check back later for new challenges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizSets.map((quiz, index) => {
              const result = quizResults[quiz._id];
              const isPassed = result?.status === 'pass';
              const isFailed = result?.status === 'fail';

              return (
                <div
                  key={quiz._id}
                  onClick={() => handleQuizClick(quiz)}
                  className="group cursor-pointer"
                >
                  <div className={`h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border overflow-hidden relative transform group-hover:-translate-y-1 ${isPassed ? 'border-green-200 ring-1 ring-green-100' :
                    isFailed ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'
                    }`}>

                    {/* Decorative Gradient Top Bar */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${isPassed ? "from-green-500 to-emerald-500" :
                      isFailed ? "from-red-500 to-pink-500" :
                        index % 3 === 0 ? "from-blue-500 to-indigo-500" :
                          index % 3 === 1 ? "from-emerald-500 to-teal-500" :
                            "from-orange-500 to-red-500"
                      }`}></div>

                    <div className="p-6 flex flex-col h-full">
                      {/* Header with Icon */}
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${isPassed ? "bg-green-50 text-green-600" :
                          isFailed ? "bg-red-50 text-red-600" :
                            index % 3 === 0 ? "bg-blue-50 text-blue-600" :
                              index % 3 === 1 ? "bg-emerald-50 text-emerald-600" :
                                "bg-orange-50 text-orange-600"
                          }`}>
                          {isPassed ? "🏆" : isFailed ? "❌" : quizIconsMap[quiz._id]}
                        </div>

                        {/* Status Badge */}
                        {isPassed && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md">
                            Completed
                          </span>
                        )}
                        {isFailed && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md">
                            Failed
                          </span>
                        )}
                        {!result && quiz.isNew && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md animate-pulse">
                            New
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                          {quiz.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${isPassed ? "bg-green-100 text-green-700" :
                            isFailed ? "bg-red-100 text-red-700" :
                              index % 3 === 0 ? "bg-blue-100 text-blue-700" :
                                index % 3 === 1 ? "bg-emerald-100 text-emerald-700" :
                                  "bg-orange-100 text-orange-700"
                            }`}>
                            {quiz.category}
                          </span>
                        </div>
                      </div>

                      {/* Footer / Metadata */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-gray-500 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            15 Qs
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            15 Mins
                          </span>
                        </div>

                        {/* Arrow Icon that appears/moves on hover */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${isPassed ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white" :
                          isFailed ? "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white" :
                            "bg-gray-50 group-hover:bg-blue-600 group-hover:text-white"
                          }`}>
                          <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Ready to take the quiz?</DialogTitle>
              <DialogDescription className="py-2">
                You are about to start <strong>"{selectedQuiz?.title}"</strong>.
                Make sure you have stable internet connection and 15 mins of free time.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleStartQuiz} className="bg-blue-600 hover:bg-blue-700">Start Quiz</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default QuizList;
