const botToggle = document.querySelector(".chatbot-toggle");
const chatbotBox = document.querySelector(".chatbot-box");
const closeChat = document.querySelector(".close-chat");

botToggle.addEventListener("click", () => {
  chatbotBox.classList.add("active");
});

closeChat.addEventListener("click", () => {
  chatbotBox.classList.remove("active");
});
