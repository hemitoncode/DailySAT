import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://hemitonworld_db_user:Ipi3zptURAhq4RXm@dailysatcluster.ouqtao6.mongodb.net/?appName=DailySATCluster";
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
      question: `In the figure above, what is the value of x if the line passes through points (${10 + (index % 5)}, ${15 + (index % 5)}) and (${20 + (index % 10)}, ${25 + (index % 10)})?`,
      choices: {
        A: `${5 + (index % 5)}`,
        B: `${6 + (index % 5)}`,
        C: `${7 + (index % 5)}`,
        D: `${8 + (index % 5)}`,
      },
      correct_answer: "A",
      explanation:
        "Use the slope formula: m = (y₂ - y₁)/(x₂ - x₁). The slope is consistent along the line.",
    },
    {
      question: `Based on the bar chart showing quarterly sales, what is the total sales for all four quarters?`,
      choices: {
        A: "350 units",
        B: "400 units",
        C: "300 units",
        D: "450 units",
      },
      correct_answer: "A",
      explanation: "Add the values represented by each bar in the chart.",
    },
    {
      question: `In the right triangle shown, if angle A is 30° and the hypotenuse is ${10 + (index % 10)}, what is the length of the side opposite to angle A?`,
      choices: {
        A: `${5 + (index % 3)}`,
        B: `${8 + (index % 3)}`,
        C: `${12 + (index % 3)}`,
        D: `${15 + (index % 3)}`,
      },
      correct_answer: "A",
      explanation:
        "In a 30-60-90 triangle, the side opposite 30° is half the hypotenuse.",
    },
    {
      question: `The scatter plot shows the relationship between hours studied and test scores. What type of correlation does it display?`,
      choices: {
        A: "Positive correlation",
        B: "Negative correlation",
        C: "No correlation",
        D: "Exponential correlation",
      },
      correct_answer: "A",
      explanation:
        "As hours studied increase, test scores generally increase, showing positive correlation.",
    },
    {
      question: `In the coordinate plane, what is the area of the triangle with vertices at (0,0), (6,0), and (3,${6 + (index % 4)})?`,
      choices: {
        A: `${9 + (index % 3)}`,
        B: `${12 + (index % 3)}`,
        C: `${15 + (index % 3)}`,
        D: `${18 + (index % 3)}`,
      },
      correct_answer: "A",
      explanation: "Area = ½ × base × height = ½ × 6 × 6 = 18 square units.",
    },
    {
      question: `The circle has a radius of ${5 + (index % 5)}. What is the circumference?`,
      choices: {
        A: `${(2 * Math.PI * (5 + (index % 5))) | 0}`,
        B: `${(Math.PI * (5 + (index % 5))) | 0}`,
        C: `${(Math.PI * (5 + (index % 5)) ** 2) | 0}`,
        D: `${(2 * (5 + (index % 5)) ** 2) | 0}`,
      },
      correct_answer: "A",
      explanation: "Circumference = 2πr = 2π × r.",
    },
    {
      question: `Based on the line graph, what was the approximate change from the first data point to the last?`,
      choices: {
        A: "An increase of 100",
        B: "A decrease of 100",
        C: "No change",
        D: "An increase of 50",
      },
      correct_answer: "A",
      explanation:
        "Calculate the difference between the starting and ending values on the graph.",
    },
    {
      question: `In the parallel lines diagram, if angle A is ${40 + (index % 20)}°, what is the measure of angle B?`,
      choices: {
        A: `${40 + (index % 20)}°`,
        B: `${140 - (index % 20)}°`,
        C: `${90}°`,
        D: `${180 - (index % 20)}°`,
      },
      correct_answer: "A",
      explanation:
        "When a transversal crosses parallel lines, corresponding angles are equal.",
    },
    {
      question: `The pie chart shows the distribution of a budget. If the total budget is $${1000 + (index % 500)}, how much is allocated to category A?`,
      choices: {
        A: `$${333 + (index % 100)}`,
        B: `$${250 + (index % 100)}`,
        C: `$${400 + (index % 100)}`,
        D: `$${500 + (index % 100)}`,
      },
      correct_answer: "A",
      explanation:
        "Category A represents ⅓ of the pie chart, so multiply total by ⅓.",
    },
    {
      question: `In the triangle, if the area is ${20 + (index % 10)} square units and the base is ${4 + (index % 4)}, what is the height?`,
      choices: {
        A: `${10 + (index % 3)}`,
        B: `${8 + (index % 3)}`,
        C: `${12 + (index % 3)}`,
        D: `${15 + (index % 3)}`,
      },
      correct_answer: "A",
      explanation:
        "Area = ½ × base × height. Rearrange to find height = (2 × area)/base.",
    },
    {
      question: `The cylinder has a radius of ${3 + (index % 4)} and height of ${8 + (index % 6)}. What is the volume?`,
      choices: {
        A: `${(Math.PI * (3 + (index % 4)) ** 2 * (8 + (index % 6))) | 0}`,
        B: `${(2 * Math.PI * (3 + (index % 4)) * (8 + (index % 6))) | 0}`,
        C: `${((3 + (index % 4)) ** 2 * (8 + (index % 6))) | 0}`,
        D: `${(Math.PI * (3 + (index % 4)) * (8 + (index % 6))) | 0}`,
      },
      correct_answer: "A",
      explanation: "Volume of cylinder = πr²h. Plug in the values for r and h.",
    },
    {
      question: `Based on the histogram showing student test scores, what percentage of students scored between 70-80?`,
      choices: {
        A: `${20 + (index % 15)}%`,
        B: `${30 + (index % 15)}%`,
        C: `${15 + (index % 15)}%`,
        D: `${25 + (index % 15)}%`,
      },
      correct_answer: "A",
      explanation:
        "Calculate the proportion of the total area that falls in the 70-80 range.",
    },
    {
      question: `In the coordinate plane, what is the midpoint between points (${2 + (index % 4)}, ${4 + (index % 4)}) and (${10 + (index % 4)}, ${12 + (index % 4)})?`,
      choices: {
        A: `(${6 + (index % 2)}, ${8 + (index % 2)})`,
        B: `(${8 + (index % 2)}, ${10 + (index % 2)})`,
        C: `(${4 + (index % 2)}, ${6 + (index % 2)})`,
        D: `(${10 + (index % 2)}, ${12 + (index % 2)})`,
      },
      correct_answer: "A",
      explanation: "Midpoint formula: ((x₁ + x₂)/2, (y₁ + y₂)/2).",
    },
    {
      question: `The cone has a height of ${10 + (index % 5)} and a radius of ${4 + (index % 3)}. What is the slant height?`,
      choices: {
        A: `${Math.sqrt(100 + (index % 5) ** 2 + 16) | 0}`,
        B: `${8 + (index % 3)}`,
        C: `${14 + (index % 3)}`,
        D: `${20 + (index % 3)}`,
      },
      correct_answer: "A",
      explanation: "Slant height = √(r² + h²). Use the Pythagorean theorem.",
    },
    {
      question: `In the intersecting lines figure, if angle A is ${50 + (index % 30)}°, what is the measure of angle C?`,
      choices: {
        A: `${50 + (index % 30)}°`,
        B: `${130 - (index % 30)}°`,
        C: `${90}°`,
        D: `${180 - (index % 30)}°`,
      },
      correct_answer: "A",
      explanation: "Vertical angles are equal. Angle C is vertical to angle A.",
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
