const { handleMessage } = require("../services/chatLogic.js");
const { mainmenu } = require("../utils/menuResponse.js");

const Session = require("../models/Sessions.js");

const chat = async (req, res) => {
  const { message, deviceId } = req.body; 

  if (!deviceId) {
      return res.status(400).json({ reply: "Device ID is required" });
  }

  try {
      let session = await Session.findOne({ deviceId });

      if (!session) {
          session = new Session({ deviceId });
      }

      
      const reply = await handleMessage(message, session);

      session.markModified('orderHistory');
      await session.save();

      res.json({ reply });
  } catch (error) {
      console.error("Error in chat controller:", error);
      res.status(500).json({ reply: "An error occurred" });
  }
};

module.exports = { chat };
