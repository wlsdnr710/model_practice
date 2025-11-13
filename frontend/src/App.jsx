import { useState } from "react";
import "./App.css";

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

  return (
    <div className="App">
      <h1>영어 리뷰 감정 분석기</h1>
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
            <strong>점수:</strong> {result.score * 100} 점 / 100점
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
