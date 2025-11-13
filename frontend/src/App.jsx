import { useState } from "react";
import "./App.css";

// 샘플 리뷰 예시 (자동 생성기능) AI 생성
const SAMPLE_REVIEWS = [
  // --- MOVIES ---
  // Very Good
  "A cinematic triumph that will be studied for decades; the directing is flawless and the score is hauntingly beautiful.",
  // Good
  "Enjoyable popcorn flick with great visual effects, though the plot is a bit thin and predictable.",
  // Neutral
  "It has its moments and the acting is fine, but it feels too long and drags in the second act.",
  // Bad
  "The pacing is a mess, the dialogue feels forced, and I couldn't connect with a single character.",
  // Very Bad
  "An absolute disaster of a film that fails on every conceivable level. I walked out after 20 minutes.",

  // --- TECH & GADGETS ---
  // Very Good
  "This smartphone is a marvel of engineering; the display is gorgeous, the battery lasts forever, and it never stutters.",
  // Good
  "Solid performance and good build quality, making it a great value option for the mid-range market.",
  // Neutral
  "It does the job reasonably well, but there are no standout features to distinguish it from last year's model.",
  // Bad
  "Constant overheating issues and poor Bluetooth connectivity make this device practically unusable for daily tasks.",
  // Very Bad
  "DO NOT BUY. It stopped working completely after two days and customer support refuses to issue a refund.",

  // --- FOOD & DINING ---
  // Very Good
  "An explosion of flavors in every bite! The chef is a genius and the staff treated us like royalty.",
  // Good
  "Tasty burgers and crispy fries, exactly what you want from a reliable neighborhood spot.",
  // Neutral
  "The food was edible but bland, and the portion sizes were a bit small considering the high price.",
  // Bad
  "My steak was overcooked and tough as leather, completely ruining what should have been a nice dinner.",
  // Very Bad
  "Found a hair in my soup, the table was sticky, and the waiter was incredibly rude when we complained.",

  // --- VIDEO GAMES ---
  // Very Good
  "A masterpiece of interactive storytelling that sets a new bar for the entire industry. I was in tears by the ending.",
  // Good
  "Fun gameplay loop and nice graphics, though the side quests get a bit repetitive after a while.",
  // Neutral
  "It's an okay time-killer if you catch it on sale, but don't expect anything revolutionary.",
  // Bad
  "Riddled with bugs, frame rate drops, and clunky controls that make it frustrating to play.",
  // Very Bad
  "Unplayable garbage. The game crashes every five minutes and the microtransactions are predatory.",

  // --- SERVICES & APPS ---
  // Very Good
  "Life-saving service! The team went above and beyond to help me meet my deadline at the last minute.",
  // Good
  "Reliable and easy to use interface, definitely makes my daily workflow much smoother.",
  // Neutral
  "Updates are frequent, but they seem to just move buttons around without adding any real value.",
  // Bad
  "Hidden fees were charged to my card without any prior notification. Very shady business practices.",
  // Very Bad
  "Total scam. They took my money, provided no service, and ghosted all my emails requesting support.",
];

function getRandomItem(arr) {
  if (arr.length == 0) return undefined;

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function App() {
  const [text, setText] = useState(""); // 인풋
  const [result, setResult] = useState(null); // 응답 저장
  const [error, setError] = useState(null); // 에러 발생
  const [loading, setLoading] = useState(false); // 응답 기다리는 구간

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      // 응답이 왔으나 오류
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          detail:
            "서버가 제대로된 응답을 보내지 않습니다. 다시 시도해주세요. (백엔드 오류)",
        }));
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      // 응답이 오지 않거나 요청 자체에서 에러 발생
      console.log(err);
      setError(
        "서버가 반응하지 않습니다. 서버가 가동중인지 체크한 후 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    setText(getRandomItem(SAMPLE_REVIEWS));
  };

  return (
    <div className="App">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <h1>영어 리뷰 감정 분석기</h1>
        <button onClick={handleGenerate}>생성하기</button>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          cols="50"
          placeholder="리뷰를 입력해주세요"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "분석중..." : "분석하기"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h2>분석 결과</h2>
          <p>
            <strong>원문:</strong> {result.input}
          </p>
          <p>
            <strong>번역:</strong> {result.translation}
          </p>
          <p>
            <strong>감정:</strong> {result.label}
          </p>
          <p>
            <strong>점수:</strong> {result.score} 점 / 100점
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
