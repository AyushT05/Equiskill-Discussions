import { auth, storage } from "../firebase/setup";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { X, HelpCircle } from "lucide-react";
import { menuItems } from "./Leftbar";

type postType = {
  setPost: (val: boolean) => void;
};

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const getAIAnswer = async (question: string): Promise<string> => {
  try {
    const res = await fetch("/groq/openai/v1/chat/completions",  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a knowledgeable academic assistant on EquiSkill, a student learning platform. Answer student questions clearly, concisely, and accurately. Keep responses focused and educational. Avoid fluff.",
          },
          { role: "user", content: question },
        ],
        max_tokens: 400,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "I was unable to generate an answer at this time.";
  } catch {
    return "AI answer unavailable at this time.";
  }
};

const PostPopup = (props: postType) => {
  const questionRef = collection(storage, "questions");
  const [quest, setQuest] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const addQuestion = async () => {
    if (!quest.trim()) return;
    setLoading(true);
    try {
      const docRef = await addDoc(questionRef, {
        question: quest,
        email: auth?.currentUser?.email ?? "anonymous",
        category: category || "General",
        solved: false,
        createdAt: new Date().toISOString(),
      });

      // Generate AI answer
      const aiAnswer = await getAIAnswer(quest);
      const answerRef = collection(storage, "questions", docRef.id, "answers");
      await addDoc(answerRef, {
        ans: aiAnswer,
        email: "ai@equiskill",
        isAI: true,
        createdAt: new Date().toISOString(),
      });

      props.setPost(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} className="text-blue-700" />
            <h2 className="text-base font-semibold text-slate-800">Ask a Question</h2>
          </div>
          <button
            onClick={() => props.setPost(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
              Your Question
            </label>
            <textarea
              value={quest}
              onChange={(e) => setQuest(e.target.value)}
              placeholder="Start with Why, What, How, Can, Is..."
              rows={4}
              className="w-full p-3 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white"
            >
              <option value="">Select a category</option>
              {menuItems.map((item) => (
                <option key={item.title} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 flex gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              An AI assistant will provide an initial answer to help get the conversation started.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={() => props.setPost(false)}
            className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={addQuestion}
            disabled={!quest.trim() || loading}
            className="flex-1 py-2.5 text-sm font-medium bg-blue-700 text-white rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Posting..." : "Post Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
