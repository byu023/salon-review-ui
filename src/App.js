import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth";

const API_URL = "https://salon-review-api.onrender.com";

function App() {
  const [session, setSession] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [review, setReview] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    checkSubscription();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const checkSubscription = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${API_URL}/api/check-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await res.json();
      setIsActive(data.active);
    } catch {
      setIsActive(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError("決済ページへの遷移に失敗しました");
    }
  };

  const handleGenerate = async () => {
    if (!review.trim()) return;
    setLoading(true);
    setReply("");
    setError("");
    setCopied(false);

    try {
      const response = await fetch(`${API_URL}/api/generate-reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review }),
      });
      if (!response.ok) throw new Error("サーバーエラーが発生しました");
      const data = await response.json();
      setReply(data.reply);
    } catch (err) {
      setError(err.message || "エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) return <Auth />;

  if (checking) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">読み込み中...</p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif" }}
        className="min-h-screen bg-rose-50 py-12 px-4">
        <div className="max-w-sm mx-auto text-center">
          <h1 className="text-3xl font-bold text-rose-600 mb-2">
            💬 口コミ返信ジェネレーター
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            サブスクリプションに登録して使い始めましょう
          </p>
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
            <p className="text-2xl font-bold text-gray-800 mb-1">¥3,000 <span className="text-sm font-normal text-gray-500">/ 月</span></p>
            <p className="text-sm text-gray-500 mb-6">いつでも解約可能</p>
            <ul className="text-sm text-gray-600 text-left mb-6 space-y-2">
              <li>✅ 口コミ返信文をAIが自動生成</li>
              <li>✅ 生成回数無制限</li>
              <li>✅ 編集してそのままコピー</li>
            </ul>
            <button
              onClick={handleSubscribe}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-3 rounded-xl transition text-sm"
            >
              今すぐ始める
            </button>
          </div>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600 underline">
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif" }}
      className="min-h-screen bg-rose-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-rose-600 mb-2">
            💬 口コミ返信ジェネレーター
          </h1>
          <p className="text-gray-500 text-sm">
            口コミを貼り付けて、返信文をAIが自動生成します
          </p>
          <button onClick={handleLogout} className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline">
            ログアウト
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            口コミを貼り付ける
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="例：スタッフの方がとても丁寧で、仕上がりも大満足でした！また来ます。"
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !review.trim()}
            className="mt-4 w-full bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-xl transition text-sm"
          >
            {loading ? "生成中..." : "返信文を生成する"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {reply && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              返信案（編集できます）
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
            />
            <button
              onClick={handleCopy}
              className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition text-sm"
            >
              {copied ? "✅ コピーしました" : "📋 コピーする"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
