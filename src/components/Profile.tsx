import { useEffect, useState } from "react";
import { auth, storage } from "../firebase/setup";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Avatar from "react-avatar";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { Trash2, CheckCircle2, Circle, ArrowLeft, MessageSquare, User, Mail, Calendar } from "lucide-react";

const Profile = () => {
  const [myQuestions, setMyQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = auth?.currentUser;

  const fetchMyQuestions = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(storage, "questions"));
      const all = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
      const mine = all.filter((q: any) => q.email === currentUser?.email);
      // Fetch answer counts
      const withCounts = await Promise.all(
        mine.map(async (q: any) => {
          const aSnap = await getDocs(collection(doc(storage, "questions", q.id), "answers"));
          return { ...q, answerCount: aSnap.size };
        })
      );
      setMyQuestions(withCounts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await deleteDoc(doc(storage, "questions", id));
      setMyQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSolved = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(storage, "questions", id), { solved: !current });
      setMyQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, solved: !current } : q))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  const displayName = currentUser?.email?.substring(0, currentUser.email.indexOf("@")) || "User";
  const solvedCount = myQuestions.filter((q) => q.solved).length;

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <div className="max-w-2xl mx-auto pt-20 pb-12 px-4">
        <Link to="/main" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={15} />
          Back to feed
        </Link>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              {currentUser?.email ? (
                <Avatar round size="64" name={currentUser.email} />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={28} className="text-slate-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">{displayName}</h1>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                <Mail size={13} />
                <span>{currentUser?.email || "Not signed in"}</span>
              </div>
              {currentUser?.metadata?.creationTime && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <Calendar size={12} />
                  <span>Joined {new Date(currentUser.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{myQuestions.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">Questions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{solvedCount}</p>
              <p className="text-xs text-slate-500 mt-0.5">Solved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">
                {myQuestions.reduce((acc, q) => acc + (q.answerCount || 0), 0)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Responses</p>
            </div>
          </div>
        </div>

        {/* Questions section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={15} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">My Questions</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : myQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <MessageSquare size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-medium">No questions yet</p>
              <Link to="/main">
                <button className="mt-4 text-sm text-blue-700 font-medium hover:underline">
                  Ask your first question
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myQuestions.map((q) => (
                <div key={q.id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        {q.category && (
                          <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-2">
                            {q.category}
                          </span>
                        )}
                        <Link to="/answers" state={{ id: q.id }}>
                          <h3 className="text-sm font-semibold text-slate-800 hover:text-blue-700 transition-colors leading-snug">
                            {q.question}?
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <MessageSquare size={11} />
                            {q.answerCount} {q.answerCount === 1 ? "answer" : "answers"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleSolved(q.id, q.solved)}
                          title={q.solved ? "Mark as unsolved" : "Mark as solved"}
                          className={`p-2 rounded-lg transition-colors ${
                            q.solved
                              ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                              : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {q.solved ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        </button>
                        <button
                          onClick={() => deleteQuestion(q.id)}
                          title="Delete question"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
