import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";

const defaultCards = [
  {
    question: "What is React?",
    answer: "React is a JavaScript library for building user interfaces.",
  },
  {
    question: "What is Vite?",
    answer: "Vite is a fast frontend build tool.",
  },
  {
    question: "What is Tailwind CSS?",
    answer: "Tailwind CSS is a utility-first CSS framework.",
  },
];

function App() {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("flashcards");
    return saved ? JSON.parse(saved) : defaultCards;
  });

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(cards));
  }, [cards]);

  const addCard = () => {
    if (!question.trim() || !answer.trim()) return;

    if (editing) {
      const updated = [...cards];

      updated[editIndex] = {
        question,
        answer,
      };

      setCards(updated);

      setEditing(false);
      setEditIndex(null);
    } else {
      setCards([
        ...cards,
        {
          question,
          answer,
        },
      ]);
    }

    setQuestion("");
    setAnswer("");
  };

  const editCard = (i) => {
    setQuestion(cards[i].question);
    setAnswer(cards[i].answer);

    setEditing(true);
    setEditIndex(i);
  };

  const deleteCard = (i) => {
    const updated = cards.filter((_, idx) => idx !== i);

    setCards(updated);

    if (updated.length === 0) {
      setIndex(0);
      return;
    }

    if (index >= updated.length) {
      setIndex(updated.length - 1);
    }
  };

  const nextCard = () => {
    if (cards.length === 0) return;

    setFlipped(false);

    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    if (cards.length === 0) return;

    setFlipped(false);

    setIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const clearAll = () => {
    setCards([]);
    setIndex(0);
    localStorage.removeItem("flashcards");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 lg:p-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Flashcard App
        </h1>

        <p className="text-slate-400 mt-3">
          Learn smarter with interactive flashcards.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[420px_1fr] gap-8">
        {/* LEFT PANEL */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">
            {editing ? "Edit Flashcard" : "Create Flashcard"}
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-slate-300">Question</label>

              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question..."
                className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-4 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-slate-300">Answer</label>

              <textarea
                rows="5"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter answer..."
                className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-4 resize-none outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={addCard}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center gap-2 font-semibold hover:scale-105 transition"
            >
              {editing ? <Save size={20} /> : <Plus size={20} />}

              {editing ? "Update Card" : "Add Flashcard"}
            </button>

            <button
              onClick={clearAll}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 transition"
            >
              Clear All
            </button>
          </div>

          {/* Card List */}
          <div className="mt-8">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold text-lg">Flashcards</h3>

              <span className="text-slate-400">{cards.length}</span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {cards.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  No flashcards found.
                </div>
              )}

              {cards.map((card, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 border transition ${
                    i === index
                      ? "bg-indigo-500/20 border-indigo-500"
                      : "bg-slate-900/50 border-slate-700"
                  }`}
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-medium flex-1">{card.question}</p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => editCard(i)}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/40 transition"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => deleteCard(i)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col items-center justify-center">
          {cards.length > 0 ? (
            <>
              <motion.div
                animate={{
                  rotateY: flipped ? 180 : 0,
                }}
                transition={{
                  duration: 0.6,
                }}
                onClick={() => setFlipped(!flipped)}
                className="relative w-full max-w-3xl h-[350px] cursor-pointer"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col justify-center items-center p-10 shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  <span className="uppercase text-sm tracking-widest text-indigo-200 mb-4">
                    Question
                  </span>

                  <h2 className="text-4xl font-bold text-center">
                    {cards[index].question}
                  </h2>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-emerald-500 to-cyan-600 flex flex-col justify-center items-center p-10 shadow-2xl"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span className="uppercase text-sm tracking-widest text-cyan-100 mb-4">
                    Answer
                  </span>

                  <h2 className="text-3xl font-semibold text-center">
                    {cards[index].answer}
                  </h2>
                </div>
              </motion.div>

              <p className="mt-5 text-slate-400">Click card to flip</p>

              {/* Buttons */}
              <div className="flex gap-5 mt-8">
                <button
                  onClick={prevCard}
                  className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center hover:scale-110 transition"
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={() => setFlipped(false)}
                  className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center hover:rotate-180 transition duration-500"
                >
                  <RotateCcw />
                </button>

                <button
                  onClick={nextCard}
                  className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center hover:scale-110 transition"
                >
                  <ChevronRight />
                </button>
              </div>

              {/* Progress */}
              <div className="w-full max-w-3xl mt-8">
                <div className="flex justify-between text-slate-400 mb-2">
                  <span>Progress</span>

                  <span>
                    {index + 1} / {cards.length}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    animate={{
                      width: `${((index + 1) / cards.length) * 100}%`,
                    }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-slate-400">
              Add a flashcard to start studying.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
