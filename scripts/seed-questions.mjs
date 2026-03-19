import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://hemitonworld_db_user:Ipi3zptURAhq4RXm@dailysatcluster.ouqtao6.mongodb.net/?retryWrites=true&w=majority";
const DB_NAME = "DailySAT";

const mathDomains = [
  "Algebra",
  "Advanced Math",
  "Problem-Solving and Data Analysis",
  "Geometry and Trigonometry",
];

const englishDomains = [
  "Information and Ideas",
  "Standard English Conventions",
  "Expression of Ideas",
  "Craft and Structure",
];

const difficulties = ["Easy", "Medium", "Hard"];

function generateMathQuestion(domain, difficulty, index) {
  const templates = [
    {
      question: `What is the sum of ${10 + (index % 10)} and ${5 + (index % 5)}?`,
      choices: {
        A: `${15 + (index % 5)}`,
        B: `${20 + (index % 5)}`,
        C: `${25 + (index % 5)}`,
        D: `${30 + (index % 5)}`,
      },
      correct_answer: "A",
      explanation: "Simply add the two numbers together.",
    },
    {
      question: `A store sold 150 units in Q1, 200 units in Q2, 175 units in Q3, and 225 units in Q4. What is the total sales for all four quarters?`,
      choices: {
        A: "750 units",
        B: "800 units",
        C: "700 units",
        D: "850 units",
      },
      correct_answer: "A",
      explanation: "Add the values: 150 + 200 + 175 + 225 = 750 units.",
    },
    {
      question: `What is the product of ${6 + (index % 4)} and ${7 + (index % 3)}?`,
      choices: {
        A: `${42 + (index % 5)}`,
        B: `${48 + (index % 5)}`,
        C: `${54 + (index % 5)}`,
        D: `${60 + (index % 5)}`,
      },
      correct_answer: "A",
      explanation: "Multiply the two numbers together.",
    },
    {
      question: `If a number is increased by 20% and then decreased by 20%, what is the net change?`,
      choices: {
        A: "A 4% decrease",
        B: "No change",
        C: "A 4% increase",
        D: "A 10% decrease",
      },
      correct_answer: "A",
      explanation:
        "1.2 * 0.8 = 0.96, which is a 4% decrease from the original.",
    },
    {
      question: `What is the area of a rectangle with length ${8 + (index % 4)} and width ${5 + (index % 3)}?`,
      choices: {
        A: `${40 + (index % 5)}`,
        B: `${45 + (index % 5)}`,
        C: `${50 + (index % 5)}`,
        D: `${55 + (index % 5)}`,
      },
      correct_answer: "A",
      explanation: "Area = length × width.",
    },
    {
      question: `If a circle has a radius of ${5 + (index % 5)}, what is the area?`,
      choices: {
        A: `${(Math.PI * (5 + (index % 5)) ** 2) | 0}`,
        B: `${(2 * Math.PI * (5 + (index % 5))) | 0}`,
        C: `${(Math.PI * (5 + (index % 5))) | 0}`,
        D: `${(2 * (5 + (index % 5)) ** 2) | 0}`,
      },
      correct_answer: "A",
      explanation: "Area = πr².",
    },
    {
      question: `A quantity decreases from 150 to 90. What is the percent decrease?`,
      choices: {
        A: "40%",
        B: "50%",
        C: "60%",
        D: "30%",
      },
      correct_answer: "A",
      explanation:
        "Decrease = 150 - 90 = 60. Percent decrease = (60 / 150) * 100 = 40%.",
    },
    {
      question: `If 3x + 5 = 20, what is the value of x?`,
      choices: {
        A: `${5 + (index % 3)}`,
        B: `${10 + (index % 3)}`,
        C: `${15 + (index % 3)}`,
        D: `${20 + (index % 3)}`,
      },
      correct_answer: "A",
      explanation: "3x = 15, so x = 5.",
    },
    {
      question: `A budget of $${1200 + (index % 500)} is divided equally among 4 categories. How much is allocated to each category?`,
      choices: {
        A: `$${300 + (index % 50)}`,
        B: `$${250 + (index % 50)}`,
        C: `$${400 + (index % 50)}`,
        D: `$${500 + (index % 50)}`,
      },
      correct_answer: "A",
      explanation: "Divide the total budget by 4.",
    },
    {
      question: `If the perimeter of a square is ${40 + (index % 20)}, what is the length of one side?`,
      choices: {
        A: `${10 + (index % 5)}`,
        B: `${15 + (index % 5)}`,
        C: `${20 + (index % 5)}`,
        D: `${25 + (index % 5)}`,
      },
      correct_answer: "A",
      explanation: "Perimeter = 4 × side. Side = Perimeter / 4.",
    },
    {
      question: `A box has a length of ${10 + (index % 5)}, width of ${5 + (index % 3)}, and height of ${3 + (index % 2)}. What is the volume?`,
      choices: {
        A: `${(10 + (index % 5)) * (5 + (index % 3)) * (3 + (index % 2))}`,
        B: `${10 + (index % 5) + (5 + (index % 3)) + (3 + (index % 2))}`,
        C: `${2 * ((10 + (index % 5)) * (5 + (index % 3)) + (5 + (index % 3)) * (3 + (index % 2)) + (3 + (index % 2)) * (10 + (index % 5)))}`,
        D: `${(10 + (index % 5)) * (5 + (index % 3)) * 2}`,
      },
      correct_answer: "A",
      explanation: "Volume = length × width × height.",
    },
    {
      question: `In a class of ${50 + (index % 10)} students, 30% are boys. How many girls are in the class?`,
      choices: {
        A: `${35 + (index % 5)}`,
        B: `${40 + (index % 5)}`,
        C: `${45 + (index % 5)}`,
        D: `${50 + (index % 5)}`,
      },
      correct_answer: "A",
      explanation: "If 30% are boys, 70% are girls. 70% of 50 = 35.",
    },
    {
      question: `What is the average of ${10 + (index % 5)}, ${20 + (index % 5)}, and ${30 + (index % 5)}?`,
      choices: {
        A: `${20 + (index % 3)}`,
        B: `${25 + (index % 3)}`,
        C: `${30 + (index % 3)}`,
        D: `${15 + (index % 3)}`,
      },
      correct_answer: "A",
      explanation: "Sum = 60, Count = 3, Average = 60 / 3 = 20.",
    },
    {
      question: `A cone has a height of ${10 + (index % 5)} and a radius of ${4 + (index % 3)}. What is the slant height?`,
      choices: {
        A: `${Math.sqrt((10 + (index % 5)) ** 2 + (4 + (index % 3)) ** 2) | 0}`,
        B: `${8 + (index % 3)}`,
        C: `${14 + (index % 3)}`,
        D: `${20 + (index % 3)}`,
      },
      correct_answer: "A",
      explanation: "Slant height = √(r² + h²). Use the Pythagorean theorem.",
    },
    {
      question: `If a number is tripled and then increased by 10, the result is 40. What was the original number?`,
      choices: {
        A: "10",
        B: "15",
        C: "20",
        D: "25",
      },
      correct_answer: "A",
      explanation: "3x + 10 = 40, so 3x = 30, x = 10.",
    },
  ];

  const template = templates[index % templates.length];
  const qNum = index + 1;

  return {
    id: `math_${domain.replace(/\s+/g, "_")}_${difficulty}_${qNum}`,
    domain: domain,
    subject: domain,
    difficulty: difficulty,
    question: {
      choices: template.choices,
      question: template.question,
      paragraph: null,
      explanation: template.explanation,
      correct_answer: template.correct_answer,
    },
  };
}

function generateEnglishQuestion(domain, difficulty, index) {
  const templates = [
    {
      question: "Which choice best states the main purpose of the passage?",
      paragraph:
        "The development of technology has profoundly changed how we communicate and process information. From the invention of the printing press to the rise of digital media, each technological advancement has reshaped human society. These changes affect not only how we receive information but also how we think about and interact with one another.",
      choices: {
        A: "To explain how technological advances have altered communication patterns",
        B: "To argue that technology has mostly had negative effects",
        C: "To describe the history of the printing press",
        D: "To compare different forms of media",
      },
      correct_answer: "A",
      explanation:
        "The passage focuses on how technology has changed communication throughout history.",
    },
    {
      question:
        "The word 'profoundly' in the passage is closest in meaning to:",
      paragraph:
        "The author's arguments were profoundly affected by her years of research in the field. Her conclusions represented a profoundly new approach to understanding the subject matter.",
      choices: {
        A: "Deeply",
        B: "Slightly",
        C: "Quickly",
        D: "Rarely",
      },
      correct_answer: "A",
      explanation:
        "In context, 'profoundly' means to a great extent or deeply.",
    },
    {
      question:
        "What can be inferred about the author's viewpoint from the passage?",
      paragraph:
        "The new policy has generated significant debate among educators. While some praise its innovative approach, others worry about potential implementation challenges. The government maintains that the benefits will outweigh any short-term difficulties.",
      choices: {
        A: "The author presents multiple perspectives on the policy",
        B: "The author strongly opposes the policy",
        C: "The author is undecided about education issues",
        D: "The author works for the government",
      },
      correct_answer: "A",
      explanation:
        "The passage presents both supportive and critical viewpoints about the policy.",
    },
    {
      question: "Which sentence best supports the main idea of the passage?",
      paragraph:
        "Urban gardens have become increasingly popular in cities across the country. These green spaces provide fresh produce for communities while also serving as educational tools for children. Additionally, they help reduce the urban heat island effect and improve air quality.",
      choices: {
        A: "Urban gardens have become increasingly popular in cities across the country.",
        B: "Children can learn about plants in these gardens.",
        C: "Cities have limited space for green areas.",
        D: "Fresh produce is expensive in stores.",
      },
      correct_answer: "A",
      explanation:
        "The main idea is stated in the first sentence about the popularity of urban gardens.",
    },
    {
      question: "The primary purpose of the second paragraph is to:",
      paragraph:
        "The city plans to renovate the downtown area. The renovation will include new sidewalks, updated streetlights, and additional green spaces. Work is expected to begin next spring and will take approximately two years to complete.",
      choices: {
        A: "Provide specific details about the planned renovation",
        B: "Criticize the city's current infrastructure",
        C: "Compare downtown to other neighborhoods",
        D: "Explain why the renovation is necessary",
      },
      correct_answer: "A",
      explanation:
        "The second paragraph gives specific examples of what the renovation will include.",
    },
    {
      question:
        "What does the phrase 'short-term difficulties' in the passage suggest about the author's perspective?",
      paragraph:
        "The new policy has generated significant debate among educators. While some praise its innovative approach, others worry about potential implementation challenges. The government maintains that the benefits will outweigh any short-term difficulties.",
      choices: {
        A: "The author believes problems will be temporary",
        B: "The author thinks problems will last forever",
        C: "The author is unsure about timing",
        D: "The author disagrees with the government",
      },
      correct_answer: "A",
      explanation:
        "The term 'short-term' implies that difficulties are temporary and will be resolved.",
    },
    {
      question:
        "Which choice provides the best transition from the first paragraph to the second?",
      paragraph:
        "The museum recently acquired a rare collection of ancient artifacts. [TRANSITION] The new exhibition features over 200 items from various civilizations.",
      choices: {
        A: "These artifacts are now on display for visitors.",
        B: "Museums face funding challenges.",
        C: "Ancient civilizations had different customs.",
        D: "Artifacts require careful preservation.",
      },
      correct_answer: "A",
      explanation:
        "This sentence naturally connects the acquisition to what visitors can now see.",
    },
    {
      question: "The author's tone in the passage can best be described as:",
      paragraph:
        "Scientists have discovered a new species of deep-sea creature near the coast. The organism displays unique characteristics that have never been observed in similar species. Researchers are excited about the implications this finding may have for marine biology.",
      choices: {
        A: "Optimistic and informative",
        B: "Critical and skeptical",
        C: "Humorous and lighthearted",
        D: "Angry and disappointed",
      },
      correct_answer: "A",
      explanation:
        "The passage presents findings in a positive, educational manner.",
    },
    {
      question: "Which statement best summarizes the passage?",
      paragraph:
        "Exercise has numerous benefits for both physical and mental health. Regular physical activity can reduce the risk of chronic diseases, improve mood, and increase energy levels. Health professionals recommend at least 30 minutes of exercise daily.",
      choices: {
        A: "Exercise provides multiple health benefits and should be done daily.",
        B: "Chronic diseases are a major health concern.",
        C: "Physical and mental health are completely unrelated.",
        D: "Only young people need regular exercise.",
      },
      correct_answer: "A",
      explanation:
        "This captures the main points about exercise benefits and recommendations.",
    },
    {
      question:
        "What evidence from the passage supports the claim that exercise improves mental health?",
      paragraph:
        "Exercise has numerous benefits for both physical and mental health. Regular physical activity can reduce the risk of chronic diseases, improve mood, and increase energy levels.",
      choices: {
        A: "exercise can improve mood",
        B: "exercise reduces chronic diseases",
        C: "exercise increases energy levels",
        D: "exercise should last 30 minutes",
      },
      correct_answer: "A",
      explanation:
        "The passage explicitly states that exercise can 'improve mood,' which relates to mental health.",
    },
  ];

  const template = templates[index % templates.length];
  const qNum = index + 1;

  return {
    id: `english_${domain.replace(/\s+/g, "_")}_${difficulty}_${qNum}`,
    domain: domain,
    subject: domain,
    difficulty: difficulty,
    question: {
      choices: template.choices,
      question: template.question,
      paragraph: template.paragraph,
      explanation: template.explanation,
      correct_answer: template.correct_answer,
    },
  };
}

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);

    console.log("Clearing existing questions...");
    await db.collection("math").deleteMany({});
    await db.collection("english").deleteMany({});

    console.log("Generating 250 math questions...");
    const mathQuestions = [];
    const questionsPerDomain = Math.floor(
      250 / (mathDomains.length * difficulties.length),
    );
    let mathIndex = 0;

    for (const domain of mathDomains) {
      for (const difficulty of difficulties) {
        for (let i = 0; i < questionsPerDomain; i++) {
          mathQuestions.push(
            generateMathQuestion(domain, difficulty, mathIndex++),
          );
        }
      }
    }

    while (mathQuestions.length < 250) {
      mathQuestions.push(
        generateMathQuestion(
          mathDomains[0],
          difficulties[0],
          mathQuestions.length,
        ),
      );
    }

    console.log("Generating 250 English questions...");
    const englishQuestions = [];
    const englishQuestionsPerDomain = Math.floor(
      250 / (englishDomains.length * difficulties.length),
    );
    let englishIndex = 0;

    for (const domain of englishDomains) {
      for (const difficulty of difficulties) {
        for (let i = 0; i < englishQuestionsPerDomain; i++) {
          englishQuestions.push(
            generateEnglishQuestion(domain, difficulty, englishIndex++),
          );
        }
      }
    }

    while (englishQuestions.length < 250) {
      englishQuestions.push(
        generateEnglishQuestion(
          englishDomains[0],
          difficulties[0],
          englishQuestions.length,
        ),
      );
    }

    console.log("Inserting math questions...");
    const mathResult = await db.collection("math").insertMany(mathQuestions);
    console.log(`Inserted ${mathResult.insertedCount} math questions`);

    console.log("Inserting English questions...");
    const englishResult = await db
      .collection("english")
      .insertMany(englishQuestions);
    console.log(`Inserted ${englishResult.insertedCount} English questions`);

    console.log("Creating indexes...");
    await db.collection("math").createIndex({ difficulty: 1, subject: 1 });
    await db.collection("english").createIndex({ difficulty: 1, subject: 1 });

    console.log("\nDone! Created 250 math and 250 English questions.");

    const mathCount = await db.collection("math").countDocuments();
    const englishCount = await db.collection("english").countDocuments();
    console.log(`\nVerification:`);
    console.log(`Math collection: ${mathCount} questions`);
    console.log(`English collection: ${englishCount} questions`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

main();
