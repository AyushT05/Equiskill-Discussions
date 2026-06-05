import Avatar from "react-avatar";
import { auth, storage } from "../firebase/setup";
import { collection, doc, getDocs, getDoc, addDoc } from "firebase/firestore";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { ArrowLeft, Bot, MessageSquare, Send, CheckCircle2, Sparkles } from "lucide-react";

const Answers = () => {
  const location = useLocation();
  const [answerData, setAnswerData] = useState<any[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [questionMeta, setQuestionMeta] = useState<any>({});
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const questionId = location?.state?.id;
  const answerDoc = doc(storage, "questions", questionId);
  const answerRef = collection(answerDoc, "answers");

  const getQuestion = async () => {
    try {
      const snap = await getDoc(answerDoc);
      if (snap.exists()) {
        setQuestion(snap.data()?.question || "Question not found");
        setQuestionMeta(snap.data() || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAnswer = async () => {
    try {
      const data = await getDocs(answerRef);
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      // Sort: AI first, then by date
      filteredData.sort((a: any, b: any) => {
        if (a.isAI && !b.isAI) return -1;
        if (!a.isAI && b.isAI) return 1;
        return 0;
      });
      setAnswerData(filteredData);

      filteredData.forEach(async (answer: any) => {
        const commentsRef = collection(doc(answerRef, answer.id), "comments");
        const commentsData = await getDocs(commentsRef);
        setComments((prev) => ({
          ...prev,
          [answer.id]: commentsData.docs.map((d) => d.data()),
        }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addAnswer = async () => {
    if (!newAnswer.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(answerRef, {
        ans: newAnswer,
        email: auth?.currentUser?.email ?? "anonymous",
        isAI: false,
        createdAt: new Date().toISOString(),
      });
      setNewAnswer("");
      getAnswer();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const addComment = async (answerId: string) => {
    if (!newComment[answerId]) return;
    try {
      const commentsRef = collection(doc(answerRef, answerId), "comments");
      await addDoc(commentsRef, {
        text: newComment[answerId],
        email: auth?.currentUser?.email || "Anonymous",
      });
      setComments((prev) => ({
        ...prev,
        [answerId]: [
          ...(prev[answerId] || []),
          { text: newComment[answerId], email: auth?.currentUser?.email || "Anonymous" },
        ],
      }));
      setNewComment({ ...newComment, [answerId]: "" });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getQuestion();
    getAnswer();
  }, []);

  const displayName = (email: string) => {
    if (email === "ai@equiskill") return "EquiSkill AI";
    return email?.substring(0, email.indexOf("@")) || "User";
  };

  const humanAnswers = answerData.filter((a) => !a.isAI);
  const aiAnswer = answerData.find((a) => a.isAI);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="max-w-2xl mx-auto pt-20 pb-12 px-4">
        {/* Back */}
        <Link to="/main" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={15} />
          Back to feed
        </Link>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          {questionMeta.category && (
            <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
              {questionMeta.category}
            </span>
          )}
          <h1 className="text-xl font-bold text-slate-900 leading-snug">{question}?</h1>
          {questionMeta.email && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <Avatar round size="24" name={questionMeta.email} />
              <span className="text-sm text-slate-500">Asked by <span className="font-medium text-slate-700">{displayName(questionMeta.email)}</span></span>
              {questionMeta.solved && (
                <div className="ml-auto flex items-center gap-1 text-emerald-600 text-xs font-medium">
                  <CheckCircle2 size={13} />
                  Solved
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Answer */}
        {aiAnswer && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI-Generated Answer</span>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">EquiSkill AI</p>

                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {aiAnswer.ans.split(/(\*\*.*?\*\*)/g).map((part: string, i: number) =>
                  part.startsWith('**') && part.endsWith('**')
                    ? <strong key={i}>{part.slice(2, -2)}</strong>
                    : part
                )}
              </p>
            </div>
          </div>
        )}

        {/* Human Answers */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {humanAnswers.length} Community {humanAnswers.length === 1 ? "Answer" : "Answers"}
            </span>
          </div>

          {humanAnswers.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-400 text-sm">No community answers yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {humanAnswers.map((data: any) => (
                <div key={data.id} className="bg-white rounded-xl border border-slate-200">
                  <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-3">
                      <Avatar round size="32" name={data?.email ?? "User"} />
                      <p className="text-sm font-semibold text-slate-800">{displayName(data.email)}</p>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{data?.ans}</p>
                  </div>

                  {/* Comments */}
                  {comments[data.id]?.length > 0 && (
                    <div className="border-t border-slate-100 px-5 py-3 space-y-2">
                      {comments[data.id].map((comment: any, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <Avatar round size="22" name={comment.email} />
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-semibold text-slate-700">{comment.email.split("@")[0]}</span>{" "}
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment */}
                  <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-2">
                    {auth?.currentUser?.email && <Avatar round size="24" name={auth.currentUser.email} />}
                    <input
                      type="text"
                      value={newComment[data.id] || ""}
                      onChange={(e) => setNewComment({ ...newComment, [data.id]: e.target.value })}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      onKeyDown={(e) => e.key === "Enter" && addComment(data.id)}
                    />
                    <button
                      onClick={() => addComment(data.id)}
                      className="p-1.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 transition-colors"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Answer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Your Answer</h3>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Share your knowledge..."
            rows={4}
            className="w-full p-3 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none mb-3"
          />
          <button
            onClick={addAnswer}
            disabled={!newAnswer.trim() || submitting}
            className="flex items-center gap-2 bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
            {submitting ? "Posting..." : "Post Answer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Answers;
