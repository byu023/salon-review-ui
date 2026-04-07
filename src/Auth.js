import { useState } from "react";
import { supabase } from "./supabase";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("確認メールを送りました。メールを確認してください。");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif" }}
      className="min-h-screen bg-rose-50 py-12 px-4">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-rose-600 mb-2">
            💬 口コミ返信ジェネレーター
          </h1>
          <p className="text-gray-500 text-sm">
            {isLogin ? "ログインして始める" : "アカウントを作成する"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 mb-4">
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition text-sm"
          >
            {loading ? "処理中..." : isLogin ? "ログイン" : "アカウント作成"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            {isLogin ? "アカウントをお持ちでない方は" : "すでにアカウントをお持ちの方は"}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
              className="text-rose-500 hover:underline ml-1"
            >
              {isLogin ? "新規登録" : "ログイン"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
