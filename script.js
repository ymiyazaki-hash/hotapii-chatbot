// ホタピィーAIチャットボット
class HotapiiChatbot {
    constructor() {
        this.chatButton = document.getElementById('chatButton');
        this.chatWindow = document.getElementById('chatWindow');
        this.closeButton = document.getElementById('closeButton');
        this.chatForm = document.getElementById('chatForm');
        this.userInput = document.getElementById('userInput');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.mouthOverlay = document.getElementById('mouthOverlay');

        this.conversationHistory = [];
        this.isLoading = false;
        this.mouthAnimationInterval = null;

        this.init();
    }

    init() {
        // イベントリスナー設定
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.closeButton.addEventListener('click', () => this.closeChat());
        this.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // Enter キーで送信（Shift+Enter は改行）
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.chatForm.dispatchEvent(new Event('submit'));
            }
        });
    }

    toggleChat() {
        if (this.chatWindow.classList.contains('hidden')) {
            this.openChat();
        } else {
            this.closeChat();
        }
    }

    openChat() {
        this.chatWindow.classList.remove('hidden');
        this.userInput.focus();
        // スクロール位置を下へ
        setTimeout(() => this.scrollToBottom(), 100);
    }

    closeChat() {
        this.chatWindow.classList.add('hidden');
    }

    async handleSubmit(e) {
        e.preventDefault();

        const message = this.userInput.value.trim();
        if (!message) return;

        // ユーザーメッセージを表示
        this.addMessage(message, 'user');
        this.userInput.value = '';

        // ローディング表示
        this.setLoading(true);

        try {
            // バックエンドにリクエスト
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = data.message;

            // 会話履歴に追加
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'assistant', content: botMessage }
            );

            // ボットメッセージを表示
            this.addMessage(botMessage, 'bot');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage(
                'ホタ〜！ごめんね、ちょっと通信がうまくいかないホタ。。。もう一度試してみてホタ〜！',
                'bot'
            );
        } finally {
            this.setLoading(false);
            this.userInput.focus();
        }
    }

    addMessage(text, sender) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message');
        messageEl.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        const contentEl = document.createElement('div');
        contentEl.classList.add('message-content');
        // 改行を <br> に変換
        contentEl.innerHTML = text.replace(/\n/g, '<br>');

        messageEl.appendChild(contentEl);
        this.messagesContainer.appendChild(messageEl);

        // ボットメッセージの時に口のアニメーション（複数回）
        if (sender === 'bot') {
            this.playMouthAnimation(3);
        }

        this.scrollToBottom();
    }

    playMouthAnimation(times) {
        let count = 0;
        const animate = () => {
            if (count < times) {
                this.mouthOverlay.classList.add('speaking');
                setTimeout(() => {
                    this.mouthOverlay.classList.remove('speaking');
                    count++;
                    setTimeout(animate, 300);
                }, 400);
            }
        };
        animate();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    setLoading(isLoading) {
        this.isLoading = isLoading;
        if (isLoading) {
            this.loadingIndicator.classList.remove('hidden');
            this.startMouthAnimation();
        } else {
            this.loadingIndicator.classList.add('hidden');
            this.stopMouthAnimation();
        }
    }

    startMouthAnimation() {
        // 既存のアニメーションを停止
        if (this.mouthAnimationInterval) {
            clearInterval(this.mouthAnimationInterval);
        }

        // 口のパクパクアニメーション
        let count = 0;
        this.mouthAnimationInterval = setInterval(() => {
            this.mouthOverlay.classList.add('speaking');
            setTimeout(() => {
                this.mouthOverlay.classList.remove('speaking');
            }, 400);
            count++;
        }, 600);
    }

    stopMouthAnimation() {
        if (this.mouthAnimationInterval) {
            clearInterval(this.mouthAnimationInterval);
            this.mouthAnimationInterval = null;
        }
        this.mouthOverlay.classList.remove('speaking');
    }
}

// ページロード時に初期化
document.addEventListener('DOMContentLoaded', () => {
    new HotapiiChatbot();
});
