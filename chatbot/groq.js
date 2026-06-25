// frontend/groq.js - Dispatches chat queries to the secure serverless backend proxy

async function askGroq(userMessage) {
    const context = buildChatContext();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds request timeout

    try {
        const response = await fetch('/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage,
                context: context
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("Server API Error details:", errData);
            throw new Error(`Server API returned status ${response.status}`);
        }

        const data = await response.json();
        if (data && data.reply) {
            return data.reply;
        } else {
            throw new Error("Invalid response format from serverless API.");
        }
    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            throw new Error("The request timed out. Please check your internet connection.");
        }
        throw err;
    }
}
