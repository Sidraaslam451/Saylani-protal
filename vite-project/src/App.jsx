import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.jsx";
import UserDashboard from "./UserDashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Role Function
  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRole(data.role);
      } else {
        setRole("user"); // default role
      }
    } catch (err) {
      console.error("Role Error:", err.message);
      setRole("user");
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data?.session;

      setSession(currentSession);

      if (currentSession) {
        await fetchRole(currentSession.user.id);
      }

      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);

        if (currentSession) {
          fetchRole(currentSession.user.id);
        } else {
          setRole(null);
          // Clear fields on logout to prevent autofill
          setEmail("");
          setPassword("");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Verification email sent! Please check inbox.");
      }
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setRole(null);
  };

  // Loading Screen
  if (loading || (session && role === null)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#0057a8]"></div>
          <div className="absolute top-0 left-0 h-20 w-20 flex items-center justify-center font-bold text-[#66b032]">
            <img src="./saylani_logo.png" alt="" />
          </div>
        </div>
        <h2 className="text-xl font-extrabold mt-6 text-[#0057a8] animate-pulse">
          Loading Saylani Hub...
        </h2>
        <p className="text-gray-400 text-sm mt-2 font-medium">
          Please wait while we secure your session
        </p>
      </div>
    );
  }

  // Session Handling
  if (session) {
    return role === "admin" ? (
      <AdminDashboard handleLogout={handleLogout} />
    ) : (
      <UserDashboard session={session} handleLogout={handleLogout} />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden max-w-md w-full border-t-8 border-[#66b032]">
        <div className="p-8">
          
          {/* 🔹 Logo Section Fixed */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-32 h-32 mb-6 bg-transparent flex items-center justify-center overflow-hidden">
              <img
                src="./saylani_logo.png"
                alt="Saylani IT Hub Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-black text-[#0057a8] tracking-tight">
              Saylani IT Hub
            </h1>
            <div className="h-1 w-12 bg-[#66b032] mt-1 rounded-full"></div>
            <p className="text-center text-gray-400 mt-3 text-xs font-bold uppercase tracking-widest">
              Empowering Youth
            </p>
          </div>

          {/* 🔹 Auth Form with Autofill Fix */}
          <form onSubmit={handleAuth} className="space-y-4" autoComplete="off">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                name="user_email_hub"
                autoComplete="off"
                placeholder="example@mail.com"
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0057a8] transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 ml-1">
                PASSWORD
              </label>
              <input
                type="password"
                name="user_pass_hub"
                autoComplete="new-password"
                placeholder="••••••••"
                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#0057a8] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0057a8] text-white p-4 rounded-xl font-bold text-lg hover:bg-[#004687] shadow-lg shadow-[#0057a8]/20 transition-all active:scale-[0.98] mt-4"
            >
              {isLogin ? "Login to Portal" : "Create Account"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-6 text-sm text-[#66b032] font-extrabold hover:text-[#589a2b] transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign Up Free"
              : "Already a member? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;