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

function extractWebsiteContent() {

    const selectors = [
        "#services",
        ".why-choose-section",
        "#blog-section",
        ".testimonial-section",
        ".team-section",
        "#contact"
    ];

    let content = "";

    selectors.forEach(selector => {

        const element =
            document.querySelector(selector);

        if(element) {

            content +=
                element.innerText + "\n\n";
        }
    });

    return content;
}

function buildChatContext() {

    const websiteContent =
        extractWebsiteContent();

    return {

        company:
            MotionAuraKnowledge.company,

        services:
            MotionAuraKnowledge.services,

        websiteContent

    };
}

function searchWebsiteContent(query) {

    const content =
        extractWebsiteContent();

    return content
        .toLowerCase()
        .includes(query.toLowerCase());
}

function detectService(message) {

    const services = {

        branding:
            ["logo", "branding", "identity"],

        motionGraphics:
            ["animation", "motion"],

        videoEditing:
            ["video", "reels", "youtube"],

        uiux:
            ["ui", "ux", "design"],

        webDevelopment:
            ["website", "web"],

        seo:
            ["seo", "ranking"]
    };

    const text =
        message.toLowerCase();

    for(const service in services) {

        const keywords =
            services[service];

        if(
            keywords.some(
                keyword =>
                    text.includes(keyword)
            )
        ) {
            return service;
        }
    }

    return null;
}



