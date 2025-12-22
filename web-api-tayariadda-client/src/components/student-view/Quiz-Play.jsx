import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { AuthContext } from "@/context/auth-context";

const QuizPlay = () => {
  const { quizSetId } = useParams();
  const navigate = useNavigate();
  const { auth } = React.useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [timerRunning, setTimerRunning] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Seed questions data
  const seedQuestions = {
    "seed-quiz-1": [
      { question: "What is the capital of Nepal?", options: ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur"], correctAnswer: 0 },
      { question: "When was Nepal declared a Federal Democratic Republic?", options: ["2006", "2007", "2008", "2009"], correctAnswer: 2 },
      { question: "What is the highest mountain in the world?", options: ["K2", "Kangchenjunga", "Mount Everest", "Lhotse"], correctAnswer: 2 },
      { question: "How many provinces are there in Nepal?", options: ["5", "6", "7", "8"], correctAnswer: 2 },
      { question: "What is the national animal of Nepal?", options: ["Tiger", "Cow", "Elephant", "Rhino"], correctAnswer: 1 },
      { question: "Which river is the longest in Nepal?", options: ["Koshi", "Gandaki", "Karnali", "Mahakali"], correctAnswer: 2 },
      { question: "What is the national flower of Nepal?", options: ["Rose", "Rhododendron", "Lotus", "Sunflower"], correctAnswer: 1 },
      { question: "In which year did Nepal join the United Nations?", options: ["1950", "1955", "1960", "1965"], correctAnswer: 1 },
      { question: "What is the currency of Nepal?", options: ["Rupee", "Dollar", "Euro", "Yen"], correctAnswer: 0 },
      { question: "Who is known as the 'Father of the Nation' in Nepal?", options: ["King Tribhuvan", "BP Koirala", "Prithvi Narayan Shah", "Mahendra Bir Bikram Shah"], correctAnswer: 2 },
      { question: "What is the national bird of Nepal?", options: ["Peacock", "Danphe (Lophophorus)", "Sparrow", "Eagle"], correctAnswer: 1 },
      { question: "Which is the largest lake in Nepal?", options: ["Phewa Lake", "Rara Lake", "Begnas Lake", "Tilicho Lake"], correctAnswer: 1 },
      { question: "What is the literacy rate of Nepal approximately?", options: ["50%", "60%", "67%", "75%"], correctAnswer: 2 },
      { question: "Which mountain range is Nepal part of?", options: ["Andes", "Himalayas", "Alps", "Rockies"], correctAnswer: 1 },
      { question: "What is the official language of Nepal?", options: ["Hindi", "English", "Nepali", "Maithili"], correctAnswer: 2 },
    ],
    "seed-quiz-2": [
      { question: "When was the Constitution of Nepal promulgated?", options: ["2015", "2016", "2017", "2018"], correctAnswer: 0 },
      { question: "How many fundamental rights are guaranteed by the Constitution?", options: ["25", "30", "31", "35"], correctAnswer: 2 },
      { question: "What is the term of the President of Nepal?", options: ["4 years", "5 years", "6 years", "7 years"], correctAnswer: 1 },
      { question: "How many members are there in the House of Representatives?", options: ["205", "245", "275", "300"], correctAnswer: 2 },
      { question: "What is the minimum age to become a member of Parliament?", options: ["21 years", "25 years", "30 years", "35 years"], correctAnswer: 1 },
      { question: "Who appoints the Chief Justice of Nepal?", options: ["Prime Minister", "President", "Parliament", "Judicial Council"], correctAnswer: 1 },
      { question: "What type of government system does Nepal have?", options: ["Presidential", "Parliamentary", "Monarchy", "Military"], correctAnswer: 1 },
      { question: "How many members are in the National Assembly?", options: ["45", "50", "59", "65"], correctAnswer: 2 },
      { question: "What is the term of the National Assembly?", options: ["4 years", "5 years", "6 years", "Permanent"], correctAnswer: 2 },
      { question: "Who is the head of the government in Nepal?", options: ["President", "Prime Minister", "King", "Chief Justice"], correctAnswer: 1 },
      { question: "What is the retirement age of Supreme Court judges?", options: ["60 years", "62 years", "65 years", "70 years"], correctAnswer: 2 },
      { question: "How many schedules are there in the Constitution of Nepal?", options: ["7", "8", "9", "10"], correctAnswer: 2 },
      { question: "What is the official name of Nepal?", options: ["Kingdom of Nepal", "Federal Democratic Republic of Nepal", "Republic of Nepal", "Democratic Nepal"], correctAnswer: 1 },
      { question: "Who has the power to dissolve the House of Representatives?", options: ["President", "Prime Minister", "Chief Justice", "Speaker"], correctAnswer: 0 },
      { question: "What is the quorum for a meeting of the House of Representatives?", options: ["1/3", "1/4", "1/2", "2/3"], correctAnswer: 1 },
    ],
    "seed-quiz-3": [
      { question: "Who is the current President of Nepal (2024)?", options: ["Bidya Devi Bhandari", "Ram Chandra Poudel", "KP Sharma Oli", "Pushpa Kamal Dahal"], correctAnswer: 1 },
      { question: "Which country hosted the 2024 Olympics?", options: ["Japan", "France", "USA", "China"], correctAnswer: 1 },
      { question: "What is the name of India's lunar mission that landed on the moon in 2023?", options: ["Chandrayaan-2", "Chandrayaan-3", "Mangalyaan", "Gaganyaan"], correctAnswer: 1 },
      { question: "Who won the FIFA World Cup 2022?", options: ["France", "Brazil", "Argentina", "Germany"], correctAnswer: 2 },
      { question: "What is the current inflation rate trend in Nepal?", options: ["Decreasing", "Increasing", "Stable", "Fluctuating"], correctAnswer: 3 },
      { question: "Which organization did Nepal recently join as a member?", options: ["NATO", "BRICS", "G20", "ASEAN"], correctAnswer: 1 },
      { question: "What is the main focus of Nepal's current Five-Year Plan?", options: ["Agriculture", "Tourism", "Economic Development", "Education"], correctAnswer: 2 },
      { question: "Which dam project is currently under construction in Nepal?", options: ["Koshi Dam", "Budhi Gandaki", "Upper Karnali", "Arun III"], correctAnswer: 3 },
      { question: "What is the current GDP growth rate of Nepal?", options: ["2-3%", "3-4%", "4-5%", "5-6%"], correctAnswer: 2 },
      { question: "Which international airport is being expanded in Nepal?", options: ["Tribhuvan", "Gautam Buddha", "Pokhara", "All of the above"], correctAnswer: 3 },
      { question: "What is the main export product of Nepal?", options: ["Tea", "Carpets", "Pashmina", "Handicrafts"], correctAnswer: 1 },
      { question: "Which country is Nepal's largest trading partner?", options: ["China", "India", "USA", "UK"], correctAnswer: 1 },
      { question: "What is the current population of Nepal approximately?", options: ["25 million", "28 million", "30 million", "32 million"], correctAnswer: 2 },
      { question: "Which sector contributes most to Nepal's GDP?", options: ["Agriculture", "Services", "Industry", "Tourism"], correctAnswer: 1 },
      { question: "What is the main source of foreign currency in Nepal?", options: ["Tourism", "Remittance", "Exports", "Foreign Aid"], correctAnswer: 1 },
    ],
  };

  // Prevent Navigation Logic
  useEffect(() => {
    if (showResults) return; // Allow navigation after finishing

    // Push state to prevent back button
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      // Optional: You could show a toast here "You cannot go back during the quiz!"
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Chrome requires returnValue to be set
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [showResults]);

  useEffect(() => {
    // Check if it's a seed quiz
    if (quizSetId.startsWith('seed-quiz-')) {
      setQuestions(seedQuestions[quizSetId] || []);
      return;
    }

    // Fetch from backend for real quizzes
    axiosInstance
      .get(`/instructor/question/${quizSetId}`)
      .then((response) => {
        if (response.data.success) {
          setQuestions(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, [quizSetId]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 && timerRunning) {
      handleSubmit();
      return;
    }

    if (timerRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, timerRunning]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: index,
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSubmitModalOpen(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentIndex(index);
  };

  const handleSubmit = async () => {
    setIsSubmitModalOpen(false);
    setTimerRunning(false);
    setShowResults(true);

    let tempWrongAnswers = [];
    let tempScore = 0;

    questions.forEach((q, index) => {
      const selected = selectedAnswers[index];
      if (selected === q.correctAnswer) {
        tempScore++;
      } else {
        tempWrongAnswers.push({
          question: q.question,
          options: q.options,
          selectedIndex: selected,
          correctIndex: q.correctAnswer,
        });
      }
    });

    setScore(tempScore);
    setWrongAnswers(tempWrongAnswers);

    // Save result to backend
    if (auth?.user?._id) {
      try {
        await axiosInstance.post("/student/quiz/submit", {
          userId: auth.user._id,
          quizId: quizSetId,
          score: tempScore,
          totalQuestions: questions.length
        });
        console.log("Quiz result saved");
      } catch (error) {
        console.error("Error saving quiz result:", error);
      }
    }
  };

  const handleNextMistake = () => {
    if (reviewIndex + 1 < wrongAnswers.length) {
      setReviewIndex(reviewIndex + 1);
    } else {
      setReviewMode(false);
    }
  };

  if (questions.length === 0) {
    return <p className="text-center text-gray-500 pt-20">Loading questions...</p>;
  }

  // Calculate stats for grid
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = questions.length;

  return (
    // Full screen overlay to block header/footer
    <div className="fixed inset-0 z-[100] bg-gray-100 overflow-auto flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">Tayari Adda Quiz</h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
            {quizSetId.startsWith("seed") ? "Practice Mode" : "Live Test"}
          </span>
        </div>

        {!showResults && (
          <div className="flex items-center gap-6">
            <div className="text-lg font-mono font-bold text-gray-700">
              Time Left: <span className={timeLeft < 60 ? "text-red-600" : "text-blue-600"}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsSubmitModalOpen(true)}
            >
              End Test
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-6 gap-6">

        {/* Main Quiz Content */}
        <div className="flex-1">
          {!showResults && !reviewMode && (
            <div className="bg-white shadow-lg p-8 rounded-xl min-h-[400px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Question {currentIndex + 1} of {totalQuestions}</span>
                  <span className="text-sm font-medium text-gray-400">
                    {selectedAnswers[currentIndex] !== undefined ? "Answered" : "Not Answered"}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold mb-8 text-gray-800 leading-relaxed">
                  {questions[currentIndex].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentIndex].options.map((option, index) => (
                    <button
                      key={index}
                      className={`block w-full text-left p-4 border rounded-lg transition-all duration-200 ${selectedAnswers[currentIndex] === index
                        ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.01]"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                        }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold ${selectedAnswers[currentIndex] === index ? "bg-white text-blue-600" : "bg-gray-200 text-gray-600"
                          }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-10 border-t pt-6">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentIndex === 0}
                  className="px-8"
                >
                  Previous
                </Button>

                <Button
                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleNextQuestion}
                >
                  {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                </Button>
              </div>
            </div>
          )}

          {/* Review Mode */}
          {reviewMode && (
            <div className="bg-white shadow-lg p-8 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-red-600">Reviewing Mistakes</h3>
                <span className="text-gray-500">Mistake {reviewIndex + 1} of {wrongAnswers.length}</span>
              </div>

              <p className="font-semibold text-xl mb-6">{wrongAnswers[reviewIndex].question}</p>

              <div className="space-y-4">
                {wrongAnswers[reviewIndex].options.map((option, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center p-4 rounded-lg text-lg border-2 ${i === wrongAnswers[reviewIndex].correctIndex
                      ? "bg-green-50 text-green-800 border-green-500"
                      : i === wrongAnswers[reviewIndex].selectedIndex
                        ? "bg-red-50 text-red-800 border-red-500"
                        : "bg-white text-gray-500 border-gray-200"
                      }`}
                  >
                    <span>{option}</span>
                    {i === wrongAnswers[reviewIndex].correctIndex && <span className="text-xl">✅</span>}
                    {i === wrongAnswers[reviewIndex].selectedIndex && <span className="text-xl">❌</span>}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={() => setReviewMode(false)}
                  className="px-6"
                >
                  Back to Results
                </Button>
                <Button
                  onClick={handleNextMistake}
                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {reviewIndex + 1 === wrongAnswers.length ? "Finish Review" : "Next Mistake"}
                </Button>
              </div>
            </div>
          )}

          {/* Results Screen */}
          {showResults && !reviewMode && (
            <div className="bg-white shadow-lg p-10 rounded-xl text-center max-w-2xl mx-auto mt-10">
              {(() => {
                const percentage = Math.round((score / totalQuestions) * 100);
                let status = "";
                let statusColor = "";
                let icon = "";
                let message = "";

                if (percentage >= 80) {
                  status = "Completed Successfully";
                  statusColor = "text-green-600";
                  icon = "🏆";
                  message = "Excellent work! You have mastered this topic.";
                } else if (percentage < 40) {
                  status = "Failed";
                  statusColor = "text-red-600";
                  icon = "❌";
                  message = "Don't give up! Review the material and try again.";
                } else {
                  status = "Good Effort";
                  statusColor = "text-orange-500";
                  icon = "⚠️";
                  message = "You passed, but you need 80% to achieve 'Completed' status.";
                }

                return (
                  <>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${percentage >= 80 ? 'bg-green-100' : percentage < 40 ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                      <span className="text-4xl">{icon}</span>
                    </div>
                    <h3 className={`text-3xl font-bold mb-2 ${statusColor}`}>{status}</h3>
                    <p className="text-gray-600 mb-8">{message}</p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Your Score</p>
                        <p className="text-3xl font-bold text-gray-800">{score} / {totalQuestions}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Accuracy</p>
                        <p className={`text-3xl font-bold ${statusColor}`}>{percentage}%</p>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 flex-wrap">
                      {wrongAnswers.length > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setReviewMode(true);
                            setReviewIndex(0);
                          }}
                        >
                          Review Mistakes
                        </Button>
                      )}

                      {percentage < 40 && (
                        <Button
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => window.location.reload()}
                        >
                          Retake Quiz
                        </Button>
                      )}

                      <Button
                        className="bg-gray-900 text-white hover:bg-gray-800"
                        onClick={() => navigate("/student/quiz")}
                      >
                        {percentage < 40 ? "Exit Quiz" : "Back to Quiz List"}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Sidebar - Question Grid & Info */}
        {!showResults && (
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white shadow-md rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Question Navigator</h3>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleJumpToQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentIndex === index
                      ? "bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1"
                      : selectedAnswers[index] !== undefined
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div> Current
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-green-500 rounded"></div> Answered
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div> Not Answered
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800 font-semibold mb-1">Progress</div>
                <div className="w-full bg-blue-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-blue-600 text-right">
                  {answeredCount} of {totalQuestions} answered
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finish Test?</DialogTitle>
            <DialogDescription>
              You have answered <span className="font-bold text-black">{answeredCount}</span> out of <span className="font-bold text-black">{totalQuestions}</span> questions.
              {answeredCount < totalQuestions && (
                <span className="block mt-2 text-red-600">
                  ⚠️ You have {totalQuestions - answeredCount} unanswered questions.
                </span>
              )}
              <br />
              Are you sure you want to submit?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Back to Quiz
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
              Confirm Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizPlay;
