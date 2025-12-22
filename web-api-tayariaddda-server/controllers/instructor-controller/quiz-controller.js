const QuizSet = require("../../models/Quiz");

// Create a new quiz set
const createQuizSet = async (req, res) => {
  try {
    const newQuizSet = new QuizSet(req.body);
    await newQuizSet.save();
    res.status(201).json({ success: true, data: newQuizSet });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating quiz set" });
  }
};

// Fetch all quiz sets with question count
const getAllQuizSets = async (req, res) => {
  try {
    const quizSets = await QuizSet.aggregate([
      {
        $lookup: {
          from: "questions", // Name of the Question collection in MongoDB (usually lowercase plural)
          localField: "_id",
          foreignField: "quizSetId",
          as: "questions"
        }
      },
      {
        $project: {
          title: 1,
          category: 1,
          description: 1,
          createdAt: 1,
          questions: 1 // Include the questions array so frontend can count .length
        }
      }
    ]);

    res.json({ success: true, data: quizSets });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching quiz sets", error: err.message });
  }
};

// Get quiz sets by category
const getQuizSetsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const quizSets = await QuizSet.find({ category });
    res.json({ success: true, data: quizSets });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching quiz sets by category" });
  }
};


// Delete a quiz set by ID and remove associated questions
const deleteQuizSet = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the quiz set
    const deletedQuizSet = await QuizSet.findByIdAndDelete(id);
    if (!deletedQuizSet) {
      return res.status(404).json({ message: "Quiz Set not found" });
    } else {
      return res.status(200).json({ message: "Deleted" });

    }

  } catch (error) {
    console.error("Error deleting quiz set:", error);
    res.status(500).json({ message: "Error deleting quiz set", error });
  }
};



// Get a single quiz set by ID
const getQuizSetById = async (req, res) => {
  try {
    const { id } = req.params;
    const quizSet = await QuizSet.findById(id).lean();

    if (!quizSet) {
      return res.status(404).json({ success: false, message: "Quiz Set not found" });
    }

    // Fetch questions associated with this quiz set
    const questions = await Question.find({ quizSetId: id }).lean();

    // Combine quiz set data with questions
    res.json({
      success: true,
      data: {
        ...quizSet,
        questions
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching quiz set", error: err.message });
  }
};

// Update a quiz set
const updateQuizSet = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuizSet = await QuizSet.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedQuizSet) {
      return res.status(404).json({ success: false, message: "Quiz Set not found" });
    }

    // If questions are provided in the body, update them (Delete old, Insert new)
    // This is a naive approach; for better performance/history, consider diffing.
    if (req.body.questions && Array.isArray(req.body.questions)) {
      // Delete existing questions for this quiz
      await Question.deleteMany({ quizSetId: id });

      // Add new questions
      const questionsToAdd = req.body.questions.map(q => ({
        ...q,
        quizSetId: id
      }));
      await Question.insertMany(questionsToAdd);
    }


    res.json({ success: true, data: updatedQuizSet });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating quiz set", error: err.message });
  }
};
const Question = require("../../models/Question");

module.exports = {
  createQuizSet,
  getAllQuizSets,
  getQuizSetsByCategory,
  deleteQuizSet,
  getQuizSetById,
  updateQuizSet
};
