# 영어 리뷰 분석

이 프로젝트는 영어 리뷰를 한국어로 번역하고, 번역된 리뷰의 감성(긍정/부정)을 분석하여 점수를 할당하는 AI 모델 활용 연습용으로 만든 간단한 웹 앱입니다.

## 기능

- 기계 번역 모델을 사용하여 영어 텍스트를 입력하고 분석을 누릅니다.
- 번역된 한국어 텍스트의 감성을 분석한 결과를 확인할 수 있습니다.

## 아키텍처

이 애플리케이션은 프런트엔드와 백엔드 서비스로 구성됩니다.

- frontend : React (Deno + Vite)
- backend : fastapi

1.  사용자는 **프론트엔드**에 영어 리뷰를 입력합니다.
2.  프런트엔드는 **백엔드**의 `/predict` 엔드포인트로 요청을 보냅니다.
3.  백엔드는 먼저 `facebook/m2m100_418M` 모델을 사용하여 영어 텍스트를 한국어로 번역합니다.
4.  그 다음, `jaehyeong/koelectra-base-v3-generalized-sentiment-analysis` 모델을 사용하여 번역된 한국어 텍스트의 감성을 분석합니다.
5.  백엔드는 번역된 텍스트, 감성 레이블(예: "[강/약]긍정/부정"), 그리고 점수를 프론트엔드로 반환합니다.
6.  프론트엔드는 사용자에게 결과를 표시합니다.

## 기술 스택

| 영역           | 기술                                                                                                        |
| :------------- | :---------------------------------------------------------------------------------------------------------- |
| **프런트엔드** | React, Vite, Deno                                                                                           |
| **백엔드**     | FastAPI, Python 3.12+                                                                                       |
| **AI 모델**    | • 번역: `facebook/m2m100_418M`<br>• 감성 분석: `jaehyeong/koelectra-base-v3-generalized-sentiment-analysis` |

## 직접 실행하기

### 사전 설치

- Python 3.12+
- Node.js 및 npm (또는 Deno)
- `uv` (Python 패키지 설치 관리자, `pip install uv`)

### 1. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd backend

# uv를 사용하여 실행 (가상환경에 자동으로 의존 라이브러리 및 모델이 설치됩니다.)
uv run main.py
```

백엔드 서버는 `http://127.0.0.1:8081`에서 실행됩니다.

### 2. 프론트엔드 설정

```bash
# 프런트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
# npm을 사용하는 경우
npm install

# Deno를 사용하는 경우
deno install

# 개발 서버 시작
# npm을 사용하는 경우
npm run dev

# Deno를 사용하는 경우
deno run dev
```

프론트엔드 애플리케이션은 `http://localhost:5173` (또는 5173 포트가 사용 중인 경우 다른 포트)에서 확인할 수 있습니다.

## Docker를 이용한 실행

이 프로젝트는 Docker 및 Docker Compose를 사용하여 컨테이너화할 수 있습니다.

### 개별 Docker 이미지 빌드

백엔드 Docker 이미지를 빌드하려면:
```sh
cd backend
docker build -t backend-app .
cd ..
```

프론트엔드 Docker 이미지를 빌드하려면:
```sh
cd frontend
docker build -t frontend-app .
cd ..
```

### 개별 Docker 컨테이너 실행

먼저, 컨테이너가 통신할 수 있도록 Docker 네트워크를 생성합니다:
```sh
docker network create my-app-network
```

그런 다음, 백엔드 컨테이너를 실행합니다:
```sh
docker run -d --network my-app-network --name backend -p 8081:8081 backend-app
```

그리고 프론트엔드 컨테이너를 실행합니다:
```sh
docker run -d --network my-app-network --name frontend -p 8080:80 -e VITE_API_URL=http://backend:8081 frontend-app
```
프론트엔드는 `http://localhost:8080`에서 접속할 수 있습니다.

### Docker Compose 사용

두 서비스를 더 쉽게 관리하려면 Docker Compose를 사용하세요. `docker-compose.yml` 파일이 있는 프로젝트의 루트 디렉토리에서 다음 명령어를 실행하세요.

*   **두 컨테이너를 빌드하고 시작하려면:**
    ```sh
    docker-compose up --build
    ```
*   **컨테이너를 백그라운드에서 시작하려면:**
    ```sh
    docker-compose up -d
    ```
*   **컨테이너와 네트워크를 중지하고 제거하려면:**
    ```sh
    docker-compose down
    ```
