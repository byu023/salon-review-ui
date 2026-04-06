import { useState } from "react";

function App() {
  const [review, setReview] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!review.trim()) return;
    setLoading(true);
    setReply("");
    setError("");
    setCopied(false);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/generate-reply", {
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
