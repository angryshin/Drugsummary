# 💊 약정리 비서 (Drug Organizer Assistant)

Gemini API를 이용하여 약물 처방 데이터를 DUR(Drug Utilization Review) 스타일로 정리해주는 웹 애플리케이션입니다.

## 🌟 주요 기능

- **자동 약물 데이터 정리**: 복잡한 약물 처방 데이터를 DUR 표준 형식으로 자동 변환
- **Gemini AI 활용**: Google의 Gemini AI를 통한 정확한 데이터 처리
- **사용자 친화적 인터페이스**: 직관적이고 현대적인 웹 UI
- **원클릭 복사**: 정리된 결과를 클립보드로 바로 복사
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 📋 출력 형식

### 입력 예시
```
20250428 073400330 리피토정20밀리그램(아토르바스타틴칼슘삼수화물)_(21.7mg/1정) atorvastatin calcium (as atorvastatin) 1 1정 1 30
```

### 출력 예시
```
DUR

2025/04/28
테그레톨정200밀리그램(카르바마제핀) 0.5정, 일일 2회, 5일
우루리버정 100mg (ursodeoxycholic acid) 1정, 일일 2회, 30일
```

## 🔧 사용 방법

### 1. Gemini API 키 준비
1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 발급
2. 웹 애플리케이션에서 API 키 입력 및 저장

### 2. 약물 데이터 입력
- 약물 처방 데이터를 텍스트 영역에 입력
- 여러 약물 데이터를 한 번에 입력 가능

### 3. 정리 실행
- "DUR 스타일로 정리하기" 버튼 클릭
- AI가 자동으로 데이터를 분석하고 정리

### 4. 결과 활용
- 정리된 결과 확인
- "복사하기" 버튼으로 클립보드에 복사

## 🚀 설치 및 실행

### 로컬 실행
1. 파일 다운로드
```bash
git clone [repository-url]
cd drug-organizer-assistant
```

2. 웹 서버 실행 (선택사항)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

3. 브라우저에서 `index.html` 열기

### 직접 실행
- `index.html` 파일을 브라우저에서 직접 열어서 사용 가능

## 📁 파일 구조

```
drug-organizer-assistant/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트
├── script.js           # JavaScript 로직
└── README.md           # 프로젝트 설명서
```

## 🔒 보안 및 개인정보

- API 키는 브라우저의 로컬 스토리지에만 저장됩니다
- 서버로 전송되지 않으며, 사용자의 브라우저에서만 관리됩니다
- 약물 데이터는 Gemini API로만 전송되며, 별도로 저장되지 않습니다

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI API**: Google Gemini Pro
- **스타일링**: CSS Grid, Flexbox, CSS Animations
- **호환성**: 모던 브라우저 (Chrome, Firefox, Safari, Edge)

## 📞 지원 및 문의

문제가 발생하거나 개선 사항이 있으시면 이슈를 등록해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

**주의사항**: 이 도구는 보조적인 목적으로만 사용하시고, 실제 의료 업무에서는 반드시 전문가의 검토를 받으시기 바랍니다. 