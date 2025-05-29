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
        this.clearBtn = document.getElementById('clearData');
        this.loading = document.getElementById('loading');
        this.outputSection = document.getElementById('outputSection');
        this.outputData = document.getElementById('outputData');
        this.copyBtn = document.getElementById('copyResult');
    }

    bindEvents() {
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.processBtn.addEventListener('click', () => this.processData());
        this.clearBtn.addEventListener('click', () => this.clearData());
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
        return `###Instruction###
다음 약물 처방 데이터를 기반으로 DUR 스타일로 정리된 출력 텍스트를 생성하세요.

조건:
- 첫 줄에 "DUR"라고 표기하세요.
- 날짜는 YYYY/MM/DD 형식으로 출력합니다.
- 같은 날짜에 여러 약물이 처방된 경우, 날짜는 한 번만 표시합니다.
- 각 약물은 한 줄로 요약하며, 다음 요소를 포함합니다:
  * 상품명(성분명 영어)
  * 복용 단위 (예: 1정, 0.5정, 1캡슐, 30g 등)
  * 1일 복용 횟수 (예: 일일 2회)
  * 치료 기간 (예: 5일, 14일, 30일)
- 약물명이 너무 길거나 복잡한 경우, 상품명과 성분명으로 최대한 간결하게 표기합니다.
- 성분명은 가능한 영어로 표기합니다.
- 분할 투여(예: 0.5정 등)나 연고, 액제 등의 단위는 정확히 반영합니다.
- 입력 데이터의 약품코드와 성분코드는 무시하고 처리하세요.

예시:
DUR

2025/04/28
테그레톨정200밀리그램(카르바마제핀) 0.5정, 일일 2회, 5일
우루리버정 100mg (ursodeoxycholic acid) 1정, 일일 2회, 30일

###Input###
${inputText}

###OutputFormat###
코드 블록(\`\`\`)으로 감싸서 출력하세요.`;
    }

    displayResult(result) {
        // 코드 블록 제거 (```plaintext 또는 ``` 등)
        let cleanResult = result.replace(/```[\w]*\n?/g, '').trim();
        
        // 결과를 코드 블록으로 감싸기
        cleanResult = '```\n' + cleanResult + '\n```';
        
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

    clearData() {
        this.inputData.value = '';
        this.outputData.textContent = '';
        this.outputSection.style.display = 'none';
        this.toggleProcessButton();
    }
}

// DOM이 로드되면 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new DrugOrganizerAssistant();
}); 