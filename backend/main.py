from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import uvicorn

app = FastAPI(title="리뷰 감정 분석")

# CORS 세팅
# 브라우저 내부적으로 보내는 options request 를 모두 차단 먹여서 추가함
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

translator = pipeline("translation", model="facebook/m2m100_418M")

sentimental = pipeline(
    "sentiment-analysis",
    # 기존 모델이 정확도가 떨어지는 듯 해서 바꿈.
    model="jaehyeong/koelectra-base-v3-generalized-sentiment-analysis",
)


class ReviewSentimental(BaseModel):
    text: str

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "text": "This musical adaptation hits the right notes, but lacks visual variety."
                }
            ]
        }
    }


@app.post("/predict")
def predict(review: ReviewSentimental):
    print("받은 문장", review.text)
    translated = translator(review.text, src_lang="en", tgt_lang="ko")[0][
        "translation_text"
    ]
    print(translated)
    result = sentimental(translated)[0]
    print(result)
    score = result["score"]
    label = result["label"]
    sentiment = ""
    if score < 0.7:
        sentiment += "약"
    elif score > 0.90:
        sentiment += "강"
    if label == "1":
        sentiment += "긍정"
    else:
        sentiment += "부정"

    if label == "1":
        final_score = 50 + 50 * score * score
    else:
        final_score = 50 - 50 * score * score

    print(label, score, sentiment)
    response = {
        "input": review.text,
        "translation": translated,
        "label": sentiment,
        "score": round(final_score, 1),
    }
    return response


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8081, reload=True)
