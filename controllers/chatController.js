const { handleMessage } = require("../services/chatLogic.js");
const { mainmenu } = require("../utils/menuResponse.js");

const chat = async (req, res) => {
  const { message } = req.body; 

  try {
      // Initialize session defaults if they don't exist
      if (!req.session.currentOrder) req.session.currentOrder = [];
      if (!req.session.orderHistory) req.session.orderHistory = [];
      if (!req.session.state) req.session.state = "IDLE";
      // We can also store deviceId in session if we really want to persist it for logs, but not needed for logic

      const reply = await handleMessage(message, req.session);

      // Explicitly save session to ensure array changes are persisted
      // express-session usually handles this, but since we modify arrays in handleMessage, safe to save.
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      res.json({ reply });
  } catch (error) {
      console.error("Error in chat controller:", error);
      res.status(500).json({ reply: "An error occurred" });
  }
};

module.exports = { chat };
