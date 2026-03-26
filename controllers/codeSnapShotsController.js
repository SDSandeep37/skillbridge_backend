import * as CodeSnapshots from "../models/codeSnapshotsModel.js";

//insert or update code acc to condition
export async function saveCode(sessionId, code) {
  //check code with session id exist
  const codeExist = await CodeSnapshots.getCodeBySessionId(sessionId);
  if (!codeExist) {
    await CodeSnapshots.createCodeSnapshot(sessionId, code);
  } else {
    await CodeSnapshots.updateCodeWithSessionId(sessionId, code);
  }
}

// load code with session id
export async function loadCode(sessionId) {
  const code = await CodeSnapshots.getCodeBySessionId(sessionId);
  return code?.content || "";
}
