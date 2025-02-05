async function sendMessage() {
    let userText = document.getElementById("userInput").value;
    let chatbox = document.getElementById("chatbox");

    // Display user message
    chatbox.innerHTML += "<p><b>You:</b> " + userText + "</p>";

    try {
        // Call Gemini API
        let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userText }] }]  // ✅ Fixed request format
            })
        });

        let data = await response.json();

        console.log("API Response:", data); // Debugging

        // ✅ Check if the response contains the AI's answer
        let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, something went wrong.";

        chatbox.innerHTML += "<p><b>AI:</b> " + aiResponse + "</p>";
    } catch (error) {
        console.error("Error:", error);
        chatbox.innerHTML += "<p><b>AI:</b> Sorry, I couldn't fetch a response.</p>";
    }

    document.getElementById("userInput").value = ""; // Clear input
}
function formatMessage(message) {
    return message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  }
  
  function sendMessage() {
    const inputField = document.getElementById("chatInput");
    let messageText = inputField.value.trim();
    if (messageText === "") return;
  
    const chatMessages = document.getElementById("chatMessages");
  
    // Create User Message with Markdown support
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.innerHTML = formatMessage(messageText); // Convert **text** to bold
    chatMessages.appendChild(userMessage);
  
    inputField.value = ""; // Clear input
  
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
  
    // Simulate AI Response with Typing Animation
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing");
    typingIndicator.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(typingIndicator);
  
    setTimeout(() => {
      typingIndicator.remove(); // Remove typing animation
  
      const botMessage = document.createElement("div");
      botMessage.classList.add("message", "bot-message");
      botMessage.innerHTML = formatMessage("Hello! **How can I help you?**"); // AI response with bold formatting
      chatMessages.appendChild(botMessage);
  
      chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }, 1500);
  }
  