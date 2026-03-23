import * as Session from "../models/sessionModel.js";

//Create session with mentor,student and topic
export async function createSessionContoller(request, response) {
  const { role, userId } = request.user;
  if (!role || role !== "mentor") {
    return response.status(400).json({
      error: "Action not allowed",
      message: "Only mentors can create a session",
    });
  }
  const { student, topic } = request.body;
  if (!student) {
    return response.status(400).json({
      error: "Student requires",
      message: "Please select a student to create a session",
    });
  }
  if (!topic) {
    return response.status(400).json({
      error: "Topic requires",
      message: "Please enter the topic of session",
    });
  }

  try {
    const mentor = userId;
    const result = await Session.createSession(mentor, student, topic);
    if (!result) {
      return response.json({
        message: "Not able to create a session please try again",
        error: "Session not created",
      });
    }
    return response.json({
      message: "Session created successfully",
      sessionDetais: result,
    });
  } catch (error) {
    console.error("Error creating session", error);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}
//Getting all the session of a student
export async function studentSessionsContoller(request, response) {
  const { userId } = request.user;
  try {
    const student_id = userId;
    const result = await Session.studentSessions(student_id);
    if (result.length == 0) {
      return response.json({
        message: "No session available",
        sessionDetails: result,
      });
    }
    return response.json({
      message: "All the session",
      sessionDetails: result,
    });
  } catch (error) {
    console.error("Error fetching session/sessions", error);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}
//Student session join controller

export async function studentSessionJoinContoller(request, response) {
  const { userId } = request.user;
  const { id } = request.params;
  if (!id) {
    return response.status(400).json({
      error: "Missing session id",
      message: "Not able to join you for this sesssion please try again",
    });
  }
  try {
    const student = userId;
    const result = await Session.updateSessionStudentJoining(id, student);

    if (!result) {
      return response.status(400).json({
        error: result,
        message: "Not able to join you for this sesssion please try again",
      });
    }

    return response.json({
      message: "Session joined successfully",
      sessionDetails: result,
    });
  } catch (error) {
    console.error("Error joining session", error);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}

//Updating the session to end the session by mentor
export async function updateSessionMentorEndingController(request, response) {
  const { userId, role } = request.user;
  const { id } = request.params;
  if (role !== "mentor") {
    return response.status(400).json({
      error: "Only mentor allowed for this action",
      message: "You are not authorised for this action",
    });
  }
  if (!id) {
    return response.status(400).json({
      error: "Session id missing",
      message: "Required details missing to end the session",
    });
  }
  try {
    const mentor_id = userId;
    // checking the mentor
    const mentorCheck = await Session.getSessionBySessionId(id);
    if (mentorCheck && mentorCheck.mentor_id === mentor_id) {
      //updating session
      const result = await Session.updateSessionMentorEnding(id, mentor_id);
      if (!result) {
        return response.status(400).json({
          error: result,
          message: "Not able to end the session, Please try again",
        });
      }
      return response.json({
        message: "Session ended successfully",
        sessionDetails: result,
      });
    }
    return response.status(400).json({
      error: "Mentor not matched",
      message: "You are not authorised to end this session",
    });
  } catch (error) {
    console.error("Error ending session", error);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}
//Getting all the session of a mentor
export async function mentorSessionsContoller(request, response) {
  const { userId } = request.user;
  try {
    const mentor_id = userId;
    const result = await Session.mentorSessions(mentor_id);
    if (result.length == 0) {
      return response.json({
        message: "No session available",
        sessionDetails: result,
      });
    }
    return response.json({
      message: "All the session",
      sessionDetails: result,
    });
  } catch (error) {
    console.error("Error fetching session/sessions", error);
    response
      .status(500)
      .json({ error: `Internal Server Error: ${error.message}` });
  }
}
