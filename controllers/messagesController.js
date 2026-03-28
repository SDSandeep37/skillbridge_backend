import * as Message from "../models/messageModel.js";

//insert or update code acc to condition
export async function saveMessage(sessionId, message, sender_id) {
  const result = await Message.createMessage(sessionId, sender_id, message);
  return await loadMessage(sessionId);
}

// load message with session id
export async function loadMessage(sessionId) {
  // await Message.getAllMessageWithSessionId(sessionId);
  const message = await Message.getRecentAddedMessage(sessionId);
  return message ? message : [];
}
// load message with session id
export async function loadMessages(request, response) {
  const { sessionId } = request.params;
  const message = await Message.getAllMessageWithSessionId(sessionId);
  const final = message.length > 0 ? message : [];
  return response.json(final);
}
