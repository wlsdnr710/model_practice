from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import uvicorn

app = FastAPI(title="리뷰 감정 분석")


translator = pipeline("translation", model="facebook/m2m100_418M")

sentimental = pipeline(
    "sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment"
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
    label = result["label"]
    score = result["score"]

    if label in ["4 stars", "5 stars"]:
        sentiment = "positive"
    elif label in ["1 star", "2 stars"]:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    print(label, score, sentiment)
    response = {
        "input": review.text,
        "translation": translated,
        "label": sentiment,
        "score": round(score, 2),
    }
    return response


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8081, reload=True)
