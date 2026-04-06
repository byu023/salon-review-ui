import { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setReviews([]);
    const response = await fetch("http://127.0.0.1:5000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    setReviews(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
          💇 サロンレビュー返信ジェネレーター
        </h1>
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ホットペッパーのURLを入力"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            onClick={handleSubmit}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
          >
            取得する
          </button>
        </div>
        {loading && (
          <p className="text-center text-gray-500 animate-pulse">取得中...</p>
        )}
        {reviews.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-6 mb-4">
            <p className="text-sm text-gray-500 mb-1">口コミ</p>
            <p className="text-gray-800 mb-4">{item.review}</p>
            <p className="text-sm text-gray-500 mb-1">返信案</p>
            <p className="text-pink-700 font-medium mb-3">{item.reply}</p>
            <button
              onClick={() => navigator.clipboard.writeText(item.reply)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1 rounded-full transition"
            >
              📋 コピー
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
