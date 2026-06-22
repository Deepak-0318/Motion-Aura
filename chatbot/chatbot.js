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

    // Convert markdown bold to HTML bold
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");

    div.innerHTML = formattedText;

    div.style.whiteSpace = "normal";

    chatMessages.appendChild(div);

    scrollToBottom();
}

function scrollToBottom() {

    chatMessages.scrollTop =
        chatMessages.scrollHeight;
}

async function handleMessage() {

    console.log("handleMessage triggered");

    const message =
        chatInput.value.trim();

    console.log("Message:", message);

    if (!message) return;

    addUserMessage(message);

    chatInput.value = "";

    const typingMessage =
        document.createElement("div");

    typingMessage.className =
        "message bot-message";

    typingMessage.textContent =
        "Typing...";

    chatMessages.appendChild(
        typingMessage
    );

    try {

        console.log("Calling Groq...");

        const reply =
            await askGroq(message);

        console.log(
            "Groq Reply:",
            reply
        );

        typingMessage.remove();

        addBotMessage(reply);

    }
    catch(error) {

        console.error(
            "Groq Error:",
            error
        );

        typingMessage.remove();

        addBotMessage(
            "Sorry, something went wrong."
        );
    }
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

    const WEBSITE_CONTENT =
        extractWebsiteContent();

    return {

        company:
            MotionAuraKnowledge.company,

        services:
            MotionAuraKnowledge.services,

        websiteContent: WEBSITE_CONTENT

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



