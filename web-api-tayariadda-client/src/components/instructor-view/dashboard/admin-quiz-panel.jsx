import React, { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, PlusCircle, Save, CheckCircle2, ChevronRight, HelpCircle, ArrowLeft, Edit, Trash, List } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchAllQuizSetsService, fetchQuizSetByIdService, updateQuizSetService, deleteQuizSetService } from "@/services";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminQuizPanel = () => {
  const [view, setView] = useState("list"); // list, create, edit
  const [quizList, setQuizList] = useState([]);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      category: "",
      description: "",
      questions: [
        { question: "", options: ["", "", "", ""], correctAnswer: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (view === "list") {
      loadQuizList();
    }
  }, [view]);

  const loadQuizList = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAllQuizSetsService();
      if (response?.success) {
        setQuizList(response.data);
      }
    } catch (error) {
      console.error("Error fetching quizzes", error);
      toast.error("Failed to load quizzes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    reset({
      title: "",
      category: "",
      description: "",
      questions: [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }],
    });
    setCurrentQuizId(null);
    setView("create");
  };

  const handleEdit = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetchQuizSetByIdService(id);
      if (response?.success) {
        const quizData = response.data;
        // Ensure questions structure matches form
        const formattedQuestions = quizData.questions?.length > 0 ? quizData.questions : [{ question: "", options: ["", "", "", ""], correctAnswer: 0 }];

        reset({
          title: quizData.title,
          category: quizData.category,
          description: quizData.description,
          questions: formattedQuestions
        });
        setCurrentQuizId(id);
        setView("edit");
      }
    } catch (error) {
      console.error("Error fetching quiz details", error);
      toast.error("Failed to load quiz details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuizSetService(id);
      toast.success("Quiz deleted successfully!");
      loadQuizList();
    } catch (error) {
      console.error("Error deleting quiz", error);
      toast.error("Failed to delete quiz.");
    }
  };

  const onSubmit = async (data) => {
    try {
      if (view === "edit" && currentQuizId) {
        await updateQuizSetService(currentQuizId, data);
        toast.success("Quiz updated successfully! 🎉");
      } else {
        await axiosInstance.post("/instructor/quiz/create", data);
        toast.success("Quiz created successfully! 🎉");
      }
      setView("list");
    } catch (error) {
      console.error("Error saving quiz", error);
      toast.error("Failed to save quiz.");
    }
  };


  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      <ToastContainer />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Quiz Master Control
          </h1>
          <p className="text-gray-500">Manage your assessments efficiently</p>
        </div>
        {view === "list" ? (
          <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-6 font-bold shadow-lg transition-all hover:scale-105 flex items-center gap-2">
            <PlusCircle size={20} /> Create New Quiz
          </Button>
        ) : (
          <Button onClick={() => setView("list")} variant="outline" className="border-gray-200 hover:bg-gray-50 rounded-xl px-6 py-6 font-bold flex items-center gap-2 text-gray-600">
            <List size={20} /> Back to List
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {quizList.length > 0 ? (
              quizList.map((quiz) => (
                <Card key={quiz._id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white group rounded-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <CardTitle className="flex justify-between items-start gap-2">
                      <span className="font-bold text-gray-800 line-clamp-2 text-lg">{quiz.title}</span>
                      {/* Delete Dialog */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-2">
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                              <Trash2 className="w-5 h-5" />
                              Delete Quiz?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <span className="font-bold text-gray-800">"{quiz.title}"</span>? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(quiz._id)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {quiz.category}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {quiz.questions?.length || 0} Questions
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-500 text-sm line-clamp-3 mb-6 h-[60px]">
                      {quiz.description || "No description provided."}
                    </p>
                    <Button
                      onClick={() => handleEdit(quiz._id)}
                      className="w-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-semibold rounded-xl flex items-center justify-center gap-2 h-11"
                    >
                      <Edit size={16} /> Edit Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                {isLoading ? "Loading quizzes..." : "No quizzes found. Create your first one!"}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="quiz-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Quiz Details Section */}
              <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 w-full" />
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-100 p-2 rounded-lg text-blue-600"><HelpCircle size={24} /></span>
                    {view === 'edit' ? 'Edit Quiz Details' : 'New Quiz Details'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Quiz Title</Label>
                      <Input
                        {...register("title", { required: true })}
                        placeholder="e.g., Advanced JavaScript Basics"
                        className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                      />
                      {errors.title && <span className="text-red-500 text-xs">Title is required</span>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium">Category</Label>
                      <Input
                        {...register("category", { required: true })}
                        placeholder="e.g., Web Development"
                        className="bg-gray-50 border-gray-200 h-12 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                      />
                      {errors.category && <span className="text-red-500 text-xs">Category is required</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Description</Label>
                    <Textarea
                      {...register("description", { required: true })}
                      placeholder="Briefly describe what this quiz covers..."
                      className="bg-gray-50 border-gray-200 min-h-[80px] rounded-xl resize-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    {errors.description && <span className="text-red-500 text-xs">Description is required</span>}
                  </div>
                </CardContent>
              </Card>

              {/* Questions Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">Q</span>
                    Questions ({fields.length})
                  </h2>
                  <Button
                    type="button"
                    onClick={() => append({ question: "", options: ["", "", "", ""], correctAnswer: 0 })}
                    className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 rounded-xl"
                  >
                    <PlusCircle size={18} className="mr-2" /> Add Question
                  </Button>
                </div>

                <AnimatePresence>
                  {fields.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-6 border border-gray-200/60 rounded-3xl shadow-sm bg-white hover:shadow-md transition-all duration-300 relative group"
                    >
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="destructive"
                          size="icon"
                          className="rounded-full w-8 h-8"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Question {index + 1}</span>
                        </div>
                        <Input
                          {...register(`questions.${index}.question`, { required: true })}
                          placeholder="Type your question here..."
                          className="text-lg font-medium border-none bg-gray-50 focus:bg-white focus:ring-0 border-b-2 border-transparent focus:border-blue-500 rounded-none px-0 transition-all placeholder:text-gray-400"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          {item.options.map((_, optIndex) => (
                            <div key={optIndex} className="relative">
                              <span className="absolute left-3 top-3 text-xs font-bold text-gray-400">
                                {["A", "B", "C", "D"][optIndex]}
                              </span>
                              <Input
                                {...register(`questions.${index}.options.${optIndex}`, { required: true })}
                                placeholder={`Option ${optIndex + 1}`}
                                className="pl-8 bg-white border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex items-center gap-4">
                          <Label className="text-sm font-medium text-gray-600">Correct Answer:</Label>
                          <div className="flex gap-2">
                            {[0, 1, 2, 3].map((optIdx) => (
                              <label key={optIdx} className="cursor-pointer">
                                <input
                                  type="radio"
                                  value={optIdx}
                                  {...register(`questions.${index}.correctAnswer`, { required: true })}
                                  className="peer sr-only"
                                />
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-gray-200 text-gray-400 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-600 font-bold transition-all">
                                  {["A", "B", "C", "D"][optIdx]}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="sticky bottom-6 z-20">
                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-900 text-white h-14 rounded-2xl text-lg font-bold shadow-2xl shadow-black/20 transform transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    {view === 'edit' ? 'Update Quiz' : 'Publish Quiz'}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminQuizPanel;
