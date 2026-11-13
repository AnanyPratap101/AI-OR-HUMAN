export const SAMPLES = [
  {
    id: 1,
    category: "Product Review",
    text: "This stainless steel water bottle offers exceptional durability and a sleek design that fits seamlessly into any lifestyle. Its innovative double-wall insulation ensures your drinks stay perfectly cold for hours. A must-have for anyone seeking quality and style.",
    truth: "AI",
    explanation: "Three cues point to AI: marketing buzzwords ('seamlessly', 'innovative', 'must-have'), no personal experience with the bottle, and perfectly balanced sentences. A real buyer usually mentions something specific, like how they used it."
  },
  {
    id: 2,
    category: "Chat Reply",
    text: "Sounds good, see you then.",
    truth: "Ambiguous",
    explanation: "Five words, no quirks, no context. People and AI write this identically, so the smart answer is that there isn't enough evidence."
  },
  {
    id: 3,
    category: "Sticky Note",
    text: "Mum called, wants you to ring back before 6. Also the gas guy is coming Thursday, I'll be at college so someone has to be home!!",
    truth: "Human",
    explanation: "Three cues point to Human: a specific everyday situation (a call, a Thursday visit, who is where), rushed punctuation ('!!'), and details that only matter to this household. There's nothing generic or polished about it."
  },
  {
    id: 4,
    category: "Job Application",
    text: "I am excited to apply for this position. With my strong communication skills, attention to detail, and passion for teamwork, I am confident I would be a valuable asset to your organization.",
    truth: "AI",
    explanation: "Three cues point to AI: a stack of generic virtues with no example of any of them, no mention of a real job or company, and a clean, formal rhythm. Nothing in it could only have come from one particular person."
  },
  {
    id: 5,
    category: "Calendar Notice",
    text: "Meeting moved to 3 PM.",
    truth: "Ambiguous",
    explanation: "Four words of plain information. Any person, assistant or automatic tool writes this the same way, so there are no clues to judge."
  },
  {
    id: 6,
    category: "Product Review",
    text: "Ordered the green one, got the blue one. Customer service took 9 days to reply and then sent me the wrong return label. Phone case itself is fine tho, fits my cracked old phone ok.",
    truth: "Human",
    explanation: "Three cues point to Human: specific complaints (wrong color, 9 days, wrong label), uneven tone that moves from annoyed to grudgingly fine, and casual wording ('tho', 'ok', 'cracked old phone'). AI reviews tend to stay smooth and general."
  },
  {
    id: 7,
    category: "Travel Blurb",
    text: "Nestled in the heart of the countryside, this charming village offers a perfect blend of tradition and modernity, making it an unforgettable destination for travelers of all ages.",
    truth: "AI",
    explanation: "Three cues point to AI: stock phrases ('nestled in the heart of', 'perfect blend of', 'unforgettable destination'), no real place, name or detail, and appeal to 'travelers of all ages'. It could describe any village anywhere."
  },
  {
    id: 8,
    category: "Diary Entry",
    text: "Missed the 7:40 bus again lol. Walked in 10 mins late and the maths teacher just looked at me. Tomorrow I'm setting two alarms, no excuses.",
    truth: "Human",
    explanation: "Three cues point to Human: a specific time and consequence, a small personal vow ('two alarms, no excuses'), and casual slang ('lol'). It reads like a quick note written in the moment."
  }
];
