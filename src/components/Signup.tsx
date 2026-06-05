import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../firebase/setup";
import { useState } from "react";
import EmailSignup from "./EmailSignup";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogIn, Brain } from "lucide-react";

const Signup = () => {
  const [emailSignup, setEmailSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const googleSignin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in successfully");
      setTimeout(() => auth?.currentUser !== null && navigate("/main"), 1500);
    } catch (err: any) {
      toast.error("Sign in failed");
    }
  };

  const facebookSignin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      toast.success("Signed in successfully");
      setTimeout(() => auth?.currentUser !== null && navigate("/main"), 1500);
    } catch (err: any) {
      toast.error("Sign in failed");
    }
  };

  const login = async () => {
    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Signed in successfully");
      setTimeout(() => data?.user?.emailVerified && navigate("/main"), 1500);
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="min-h-screen bg-slate-50 flex">
        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-700 flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">EquiSkill Discussions</span>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Where students come to learn from each other
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed">
              Ask questions, share knowledge, and get AI-powered answers instantly. A community built for curious minds.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Questions", value: "10k+" },
              { label: "Students", value: "2k+" },
              { label: "Topics", value: "7" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-blue-200 text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-500 text-sm mt-1">Sign in to continue learning</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={googleSignin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <button
                onClick={facebookSignin}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs text-slate-400 bg-slate-50 px-3">
                or sign in with email
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              <button
                onClick={login}
                className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 rounded-xl transition-colors"
              >
                <LogIn size={16} />
                Sign In
              </button>

              <p className="text-center text-sm text-slate-500">
                New here?{" "}
                <button
                  onClick={() => setEmailSignup(true)}
                  className="text-blue-700 font-medium hover:underline"
                >
                  Create an account
                </button>
              </p>
            </div>

            <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
              By continuing, you agree to EquiSkill's{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span> and{" "}
              <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>

      {emailSignup && <EmailSignup setEmailSignup={setEmailSignup} />}
    </>
  );
};

export default Signup;
