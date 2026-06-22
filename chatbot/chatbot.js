const chatMessages =
    document.getElementById("chatMessages");

const chatInput =
    document.getElementById("chatInput");

const sendBtn =
    document.getElementById("sendBtn");

function addUserMessage(text) {

    const div =
        document.createElement("div");

    div.className =
        "message user-message";

    div.textContent = text;

    chatMessages.appendChild(div);

    scrollToBottom();
}

function addBotMessage(text) {

    const div =
        document.createElement("div");

    div.className =
        "message bot-message";

    div.textContent = text;

    chatMessages.appendChild(div);

    scrollToBottom();
}

function scrollToBottom() {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}

function handleMessage() {

    const message =
        chatInput.value.trim();

    if (!message) return;

    addUserMessage(message);

    chatInput.value = "";

    setTimeout(() => {

        addBotMessage(
            "Thanks! Groq integration coming next."
        );

    }, 500);
}

sendBtn.addEventListener(
    "click",
    handleMessage
);

chatInput.addEventListener(
    "keypress",
    (e) => {

        if (e.key === "Enter") {
            handleMessage();
        }

    }
);