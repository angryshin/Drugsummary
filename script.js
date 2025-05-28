class DrugOrganizerAssistant {
    constructor() {
        this.apiKey = localStorage.getItem('geminiApiKey') || '';
        this.initializeElements();
        this.bindEvents();
        this.checkApiKey();
    }

    initializeElements() {
        this.apiKeyInput = document.getElementById('apiKey');
        this.saveApiKeyBtn = document.getElementById('saveApiKey');
        this.apiKeyStatus = document.getElementById('apiKeyStatus');
        this.inputData = document.getElementById('inputData');
        this.processBtn = document.getElementById('processData');
        this.loading = document.getElementById('loading');
        this.outputSection = document.getElementById('outputSection');
        this.outputData = document.getElementById('outputData');
        this.copyBtn = document.getElementById('copyResult');
    }

    bindEvents() {
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.processBtn.addEventListener('click', () => this.processData());
        this.copyBtn.addEventListener('click', () => this.copyResult());
        this.inputData.addEventListener('input', () => this.toggleProcessButton());
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            this.showApiKeyStatus('API 키를 입력해주세요.', 'error');
            return;
        }

        localStorage.setItem('geminiApiKey', apiKey);
        this.apiKey = apiKey;
        this.showApiKeyStatus('API 키가 저장되었습니다.', 'success');
        this.toggleProcessButton();
    }

    checkApiKey() {
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
            this.showApiKeyStatus('API 키가 저장되어 있습니다.', 'success');
        }
        this.toggleProcessButton();
    }

    showApiKeyStatus(message, type) {
        this.apiKeyStatus.textContent = message;
        this.apiKeyStatus.className = type;
    }

    toggleProcessButton() {
        const hasApiKey = this.apiKey || this.apiKeyInput.value.trim();
        const hasInput = this.inputData.value.trim();
        this.processBtn.disabled = !(hasApiKey && hasInput);
    }

    async processData() {
        const inputText = this.inputData.value.trim();
        if (!inputText) {
            alert('약물 처방 데이터를 입력해주세요.');
            return;
        }

        if (!this.apiKey) {
            alert('Gemini API 키를 먼저 저장해주세요.');
            return;
        }

        this.showLoading(true);
        this.outputSection.style.display = 'none';

        try {
            const result = await this.callGeminiAPI(inputText);
            this.displayResult(result);
        } catch (error) {
            console.error('Error:', error);
            alert('처리 중 오류가 발생했습니다: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async callGeminiAPI(inputText) {
        const prompt = this.createPrompt(inputText);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API 호출 실패: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('API 응답에서 결과를 찾을 수 없습니다.');
        }

        return data.candidates[0].content.parts[0].text;
    }

    createPrompt(inputText) {
        return `다음 약물 처방 데이터를 기반으로 DUR 스타일로 정리된 출력 텍스트를 생성하세요.

조건:
- 첫 줄에 "DUR"라고 표기하세요.
- 날짜는 첫 줄 다음 줄에 YYYY/MM/DD 형식으로 한 번만 출력합니다.
- 이후 각 약물은 한 줄씩 출력하며, 다음 형식으로 정리합니다:

  [약품명 (성분명)] [용량] [형태 약어] [횟수] 회 [시간 약어] [기간]일

- 성분명은 가능하면 영어로 표현하세요.

예시:
리피토정 20mg (atorvastatin calcium) 1 T 1 회 D 30일

용어 정의:
- 형태 약어: 정 = T, 캡슐 = C, 주사 = SYR, 크림/튜브 = TU
- 복용 시간 약어:
  - D: 하루 1회
  - DE: 하루 1회 (저녁)
  - B: 하루 2회
  - SC: 피하주사
  - OIHS: 병변 피부에 도포

입력 데이터:
${inputText}

출력은 복사 및 붙여넣기 편한 plaintext 형식으로 제공하고, 코드 블록 없이 바로 결과만 출력하세요.`;
    }

    displayResult(result) {
        // 코드 블록 제거 (```plaintext 또는 ``` 등)
        let cleanResult = result.replace(/```[\w]*\n?/g, '').trim();
        
        this.outputData.textContent = cleanResult;
        this.outputSection.style.display = 'block';
        this.outputSection.scrollIntoView({ behavior: 'smooth' });
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }

    async copyResult() {
        try {
            await navigator.clipboard.writeText(this.outputData.textContent);
            
            // 버튼 텍스트 임시 변경
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✅ 복사됨!';
            this.copyBtn.style.background = '#28a745';
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.style.background = '';
            }, 2000);
            
        } catch (error) {
            console.error('복사 실패:', error);
            alert('복사에 실패했습니다. 수동으로 복사해주세요.');
        }
    }
}

// DOM이 로드되면 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new DrugOrganizerAssistant();
}); 