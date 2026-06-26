// Core DOM references
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    if (chatMessages && chatInput && sendBtn) {
        // Register event listeners
        sendBtn.addEventListener("click", handleMessage);
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleMessage();
            }
        });

        // Initialize Quick Action Buttons
        initQuickActions();
    }
});

// Phase 6: Quick Action Buttons
function initQuickActions() {
    if (!chatMessages) return;

    const container = document.createElement("div");
    container.className = "quick-actions-container";

    const actions = [
        { label: "🎨 Our Services", prompt: "What services do you offer?" },
        { label: "💼 Portfolio", prompt: "Can I see some portfolio highlights?" },
        { label: "💰 Pricing", prompt: "How does your pricing work?" },
        { label: "📞 Contact Us", prompt: "How can I contact the MotionAura team?" },
        { label: "📅 Book a Call", prompt: "I would like to book a call with your team." },
        { label: "🚀 Start a Project", prompt: "I want to start a new project with you." },
        { label: "❓ FAQs", prompt: "What are some frequently asked questions?" }
    ];

    actions.forEach(action => {
        const btn = document.createElement("button");
        btn.className = "quick-action-btn";
        btn.textContent = action.label;
        btn.addEventListener("click", () => {
            chatInput.value = action.prompt;
            handleMessage();
        });
        container.appendChild(btn);
    });

    chatMessages.appendChild(container);
    scrollToBottom();
}

// Helper to add user messages in UI
function addUserMessage(text) {
    if (!chatMessages) return;
    const div = document.createElement("div");
    div.className = "message user-message";
    div.textContent = text;
    chatMessages.appendChild(div);
    scrollToBottom();
}

// Helper to add bot messages in UI
function addBotMessage(text) {
    if (!chatMessages) return;
    const div = document.createElement("div");
    div.className = "message bot-message";

    // Clean formatting and convert markdown bullets / bold text to HTML
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/^\s*[\-\•]\s+(.*)$/gm, "• $1") // normalize lists
        .replace(/\n/g, "<br>");

    div.innerHTML = formattedText;
    div.style.whiteSpace = "normal";
    chatMessages.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Phase 3: FAQ Shortcut Engine
function checkFAQ(message) {
    const text = message.toLowerCase().trim();
    const k = window.MotionAuraKnowledge;
    if (!k) return null;

    // 1. Business Hours & Support Hours
    if (text.includes("hour") || text.includes("timing") || text.includes("open") || text.includes("when are you open")) {
        return `Our support and operations are active: <strong>${k.company.support}</strong> (Monday to Friday).`;
    }

    // 2. Email Contact
    if (text.includes("email") || text.includes("mail") || text.includes("gmail")) {
        return `You can email us directly at: <a href="mailto:${k.company.email}">${k.company.email}</a>.`;
    }

    // 3. Website Link
    if (text.includes("website") || text.includes("url") || text.includes("link") || text.includes("site")) {
        // Exclude general queries about website building
        if (!text.includes("build") && !text.includes("make") && !text.includes("need a")) {
            return `Visit our official homepage at: <a href="${k.company.website}" target="_blank">${k.company.website}</a>.`;
        }
    }

    // 4. Contact Info
    if (text.includes("contact") || text.includes("phone") || text.includes("reach") || text.includes("call")) {
        if (!text.includes("book") && !text.includes("schedule")) {
            return `You can reach out to us via email at <a href="mailto:${k.contact.email}">${k.contact.email}</a>. Our support hours are ${k.contact.supportHours}.`;
        }
    }

    // 5. Pricing & Consultation
    if (text.includes("pricing") || text.includes("price") || text.includes("cost") || text.includes("how much") || text.includes("rate")) {
        return `${k.pricing.note} We also offer a <strong>${k.pricing.consultation}</strong>. Would you like to discuss your project requirements?`;
    }

    // 6. Portfolio & Showcases
    if (text.includes("portfolio") || text.includes("work") || text.includes("projects") || text.includes("showcase")) {
        return `Here are some of our portfolio highlights:<br><br>` +
               `🎨 <strong>Branding:</strong> ${k.portfolio.branding.join(", ")}<br>` +
               `🎬 <strong>Motion Design:</strong> ${k.portfolio.motion.join(", ")}<br>` +
               `🖥️ <strong>UI/UX:</strong> ${k.portfolio.uiux.join(", ")}<br><br>` +
               `You can check out dedicated showcases via the filter headers on our works page.`;
    }

    // 7. Revisions
    if (text.includes("revision")) {
        return `<strong>Revision Policy:</strong> ${k.faq.revisions} We ensure that our deliverables align perfectly with your expectations.`;
    }

    // 8. Payment Policies
    if (text.includes("payment") || text.includes("deposit") || text.includes("pay")) {
        return `<strong>Payment Terms:</strong> ${k.faq.payment} Milestone breakdown options are customized based on the contract details.`;
    }

    // 9. Consultation details
    if (text.includes("consultation") || text.includes("consult")) {
        return `We offer a <strong>${k.pricing.consultation}</strong>! You can contact us to set up a scoping meeting.`;
    }

    // 10. Support terms
    if (text.includes("support") || text.includes("help")) {
        return `We offer dedicated post-delivery assistance. Our support desk operates from ${k.contact.supportHours} (Mon-Fri).`;
    }

    // 11. Company general profile
    if (text.includes("company") || text.includes("about") || text.includes("who is motionaura") || text.includes("motion aura")) {
        if (text.includes("about") || text.includes("who") || text.includes("what is")) {
            return `<strong>${k.company.name}</strong> is a creative digital agency.<br><br>${k.company.description}<br><br><strong>Our Mission:</strong> ${k.mission.description}`;
        }
    }

    // 12. Services breakdown
    if (text.includes("service") || text.includes("what do you do") || text.includes("offer") || text.includes("capabilities")) {
        const sList = k.services.map(s => `• <strong>${s.name}</strong>: ${s.description}`).join("<br>");
        return `MotionAura provides comprehensive creative services:<br><br>${sList}<br><br>Would you like to discuss a specific project?`;
    }

    return null;
}

// Phase 4: Context Awareness
function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    const pageMap = {
        'index.html': 'Homepage (Services & About Overview)',
        'branding-works.html': 'Brand Strategy & Identity Showcase',
        'motion-design-works.html': 'Motion Design & Animation Showcase',
        'uiux-works.html': 'UI/UX Design Showcase',
        'video-production-works.html': 'Video Production & Editing Showcase',
        'blog.html': 'Latest Articles & Insights Blog',
        'why-brand-videos-fail.html': 'Blog Article: Why 90% of Brand Videos Fail',
        'contact.html': 'Contact Page (Enquiry Form & Call Booking)'
    };

    return pageMap[filename] || filename;
}

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
        const element = document.querySelector(selector);
        if (element) {
            content += element.innerText + "\n\n";
        }
    });
    return content;
}

function buildChatContext() {
    const WEBSITE_CONTENT = extractWebsiteContent();
    const currentPage = getCurrentPageName();

    return {
        knowledge: window.MotionAuraKnowledge || {},
        websiteContent: WEBSITE_CONTENT,
        currentPage: currentPage
    };
}

// Phase 5: AI Lead Capture EmailJS integration
function sendLeadEmails(leadData) {
    const templateParams = {
        from_name: leadData.name || "Unknown Lead",
        reply_to: leadData.email || "N/A",
        phone: leadData.phone || "N/A",
        company: leadData.company || "N/A",
        service: leadData.service || "N/A",
        message: leadData.message || "N/A"
    };

    console.log("Chatbot: sending lead information via EmailJS...", templateParams);

    // Email #1: Send Lead notification to MotionAura
    emailjs.send('service_1593458', 'template_408cw1f', templateParams)
        .then(() => console.log("Chatbot lead notification sent successfully"))
        .catch(err => console.error("Chatbot lead email failed:", err));

    // Email #2: Send Auto Reply to customer
    emailjs.send('service_1593458', 'template_1zc9wfn', templateParams)
        .then(() => console.log("Chatbot confirmation auto-reply sent successfully"))
        .catch(err => console.error("Chatbot auto-reply failed:", err));
}

// Core Chat messaging handler
async function handleMessage() {
    if (!chatInput || !chatMessages) return;

    const message = chatInput.value.trim();
    if (!message) return;

    // Display user message in UI
    addUserMessage(message);
    chatInput.value = "";

    // Insert typing indicator
    const typingMessage = document.createElement("div");
    typingMessage.className = "message bot-message typing-indicator";
    typingMessage.textContent = "Typing...";
    chatMessages.appendChild(typingMessage);
    scrollToBottom();

    // 1. Check local FAQ Engine first (Phase 3)
    const faqReply = checkFAQ(message);
    if (faqReply) {
        // Wait briefly to simulate normal chat response speed
        setTimeout(() => {
            typingMessage.remove();
            addBotMessage(faqReply);
        }, 600);
        return;
    }

    // 2. Call Groq secure serverless endpoint
    try {
        let reply = await askGroq(message);
        typingMessage.remove();

        // Check if response contains a lead information data block (Phase 5)
        const leadRegex = /<lead_info>([\s\S]*?)<\/lead_info>/;
        const match = reply.match(leadRegex);
        if (match) {
            try {
                const leadData = JSON.parse(match[1].trim());
                sendLeadEmails(leadData);
            } catch (jsonErr) {
                console.error("Chatbot failed to parse lead JSON block:", jsonErr);
            }
            // Filter out raw JSON data tags from user-facing conversation
            reply = reply.replace(leadRegex, "").trim();
        }

        addBotMessage(reply);

    } catch (error) {
        console.error("Chatbot dispatch handler error:", error);
        typingMessage.remove();

        // Graceful customer error presentation
        let friendlyError = "I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or write to us directly at <strong>hello@motionaura.co</strong>!";
        if (error.message.includes("timed out")) {
            friendlyError = "The connection timed out. Please check your internet connection and try sending your message again.";
        }
        addBotMessage(friendlyError);
    }
}
