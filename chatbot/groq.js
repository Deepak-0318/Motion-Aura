// groq.js

import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

function buildSystemPrompt(context) {

    return `

You are MotionAura AI Assistant.

Company:
${context.company}

Services:
${context.services.join(", ")}

Website Content:
${context.websiteContent}

Your personality:

- Professional
- Friendly
- Helpful
- Creative
- Sales-oriented

Rules:

1. Use bullet points when listing services.
2. Do NOT use markdown symbols like ** or ##.
3. Keep answers under 120 words.
4. Use simple HTML-friendly formatting.
5. Answer only about MotionAura.

`;
}

async function askGroq(userMessage) {

    const context =
        buildChatContext();

    const response =
        await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${apiKey}`
                },

                body: JSON.stringify({

                    model:
                        "llama-3.3-70b-versatile",

                    messages: [

                        {
                            role: "system",
                            content:
                                buildSystemPrompt(
                                    context
                                )
                        },

                        {
                            role: "user",
                            content:
                                userMessage
                        }
                    ],

                    temperature: 0.4
                })
            }
        );

    const data =
        await response.json();

    return data.choices[0]
        .message.content;
}

