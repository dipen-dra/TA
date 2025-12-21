const mongoose = require("mongoose");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");

// MongoDB connection string
const MONGODB_URI = "mongodb://localhost:27017/tayariadda-server";

// Quiz data
const quizData = [
    {
        title: "Loksewa General Knowledge - Part 1",
        category: "General Knowledge",
        description: "Test your knowledge about Nepal's geography, history, and culture",
        questions: [
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
        ]
    },
    {
        title: "Nepal Constitution & Governance",
        category: "Constitution",
        description: "Questions about Nepal's Constitution and government structure",
        questions: [
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
        ]
    },
    {
        title: "Current Affairs 2024",
        category: "Current Affairs",
        description: "Stay updated with recent events and developments in Nepal",
        questions: [
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
        ]
    }
];

async function seedQuizzes() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB");

        // Clear existing Loksewa quizzes (optional)
        await Quiz.deleteMany({ category: { $in: ["General Knowledge", "Constitution", "Current Affairs"] } });
        console.log("🗑️  Cleared existing Loksewa quizzes");

        // Insert quizzes and questions
        for (const quizItem of quizData) {
            // Create quiz
            const quiz = await Quiz.create({
                title: quizItem.title,
                category: quizItem.category,
                description: quizItem.description,
            });

            console.log(`✅ Created quiz: ${quiz.title}`);

            // Create questions for this quiz
            const questions = quizItem.questions.map(q => ({
                quizSetId: quiz._id,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
            }));

            await Question.insertMany(questions);
            console.log(`✅ Added ${questions.length} questions to ${quiz.title}`);
        }

        console.log("\n🎉 Successfully seeded all Loksewa quizzes!");
        console.log(`Total quizzes added: ${quizData.length}`);
        console.log(`Total questions added: ${quizData.reduce((sum, q) => sum + q.questions.length, 0)}`);

    } catch (error) {
        console.error("❌ Error seeding quizzes:", error);
    } finally {
        await mongoose.connection.close();
        console.log("👋 Database connection closed");
    }
}

// Run the seed function
seedQuizzes();
