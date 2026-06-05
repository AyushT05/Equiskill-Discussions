import Avatar from "react-avatar";
import { auth, storage } from "../firebase/setup";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostPopup from "./PostPopup";
import { MessageSquare, ChevronRight, PenLine, CheckCircle2, Tag } from "lucide-react";

type searchProp = {
  search: any;
  menu: any;
};

const Rightbar = (props: searchProp) => {
  const questionRef = collection(storage, "questions");
  const [questionData, setQuestionData] = useState<any[]>([]);
  const [commentToggle, setCommentToggle] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [post, setPost] = useState(false);
  const [answerCounts, setAnswerCounts] = useState<{ [key: string]: number }>({});

  const getQuestion = async () => {
    try {
      const data = await getDocs(questionRef);
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setQuestionData(filteredData);

      // fetch answer counts
      filteredData.forEach(async (q: any) => {
        const aRef = collection(doc(storage, "questions", q.id), "answers");
        const aSnap = await getDocs(aRef);
        setAnswerCounts((prev) => ({ ...prev, [q.id]: aSnap.size }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  const addAnswer = async (questionId: string) => {
    const text = answers[questionId];
    if (!text?.trim()) return;
    try {
      const answerDoc = doc(storage, "questions", questionId);
      const answerRef = collection(answerDoc, "answers");
      await addDoc(answerRef, {
        ans: text,
        email: auth?.currentUser?.email ?? "anonymous",
        isAI: false,
        createdAt: new Date().toISOString(),
      });
      setAnswers((prev) => ({ ...prev, [questionId]: "" }));
      setCommentToggle(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getQuestion();
  }, []);

  const filtered = questionData.filter((data: any) => {
    if (props?.search) return data?.question?.toLowerCase().includes(props.search.toLowerCase());
    if (props?.menu?.title) return data?.category === props.menu.title || data?.question?.includes(props.menu.title);
    return true;
  });

  const displayName = (email: string) => email?.substring(0, email.indexOf("@")) || "User";

  return (
    <div className="space-y-4">
      {/* Ask prompt */}
      <div
        onClick={() => setPost(true)}
        className="bg-white rounded-xl border border-slate-200 p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all group"
      >
        <div className="flex items-center gap-3">
          {auth?.currentUser?.email ? (
            <Avatar round size="36" name={auth.currentUser.email} />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
              <PenLine size={16} className="text-slate-400" />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-slate-400 group-hover:text-slate-600 transition-colors">
              What do you want to ask or share?
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-blue-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <PenLine size={14} />
            Ask
          </div>
        </div>
      </div>

      {/* Feed header */}
      {props?.menu?.title && (
        <div className="flex items-center gap-2 px-1">
          <Tag size={14} className="text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">{props.menu.title}</span>
          <span className="text-xs text-slate-400">· {filtered.length} questions</span>
        </div>
      )}

      {/* Questions */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <MessageSquare size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">No questions yet</p>
          <p className="text-slate-400 text-xs mt-1">Be the first to ask something!</p>
        </div>
      ) : (
        filtered.map((data: any) => (
          <div key={data.id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
            {/* Question header */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <Avatar round size="32" name={data?.email ?? "User"} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{displayName(data.email)}</p>
                    {data.category && (
                      <span className="text-xs text-blue-600 font-medium">{data.category}</span>
                    )}
                  </div>
                </div>
                {data.solved && (
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle2 size={12} />
                    Solved
                  </div>
                )}
              </div>

              <h2 className="text-base font-semibold text-slate-900 leading-snug">
                {data?.question}?
              </h2>
            </div>

            <div className="border-t border-slate-100 px-5 py-3 flex items-center gap-3">
              <button
                onClick={() => setCommentToggle(commentToggle === data.id ? null : data.id)}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-700 transition-colors"
              >
                <MessageSquare size={15} />
                <span>{answerCounts[data.id] ?? 0} Answers</span>
              </button>

              <div className="flex-1" />

              <Link to="/answers" state={{ id: data?.id }}>
                <button className="flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors">
                  View Answers
                  <ChevronRight size={15} />
                </button>
              </Link>
            </div>

            {/* Inline answer input */}
            {commentToggle === data.id && (
              <div className="border-t border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  {auth?.currentUser?.email ? (
                    <Avatar round size="30" name={auth.currentUser.email} />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-100" />
                  )}
                  <input
                    value={answers[data.id] || ""}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [data.id]: e.target.value }))}
                    placeholder="Write your answer..."
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    onKeyDown={(e) => e.key === "Enter" && addAnswer(data.id)}
                  />
                  <Link to="/answers" state={{ id: data.id }}>
                    <button
                      onClick={() => addAnswer(data.id)}
                      className="px-3 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Post
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {post && <PostPopup setPost={setPost} />}
    </div>
  );
};

export default Rightbar;
