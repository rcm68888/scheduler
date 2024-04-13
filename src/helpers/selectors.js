function getAppointmentsForDay(state, day) {
  const daysArray = [];
  for (const aptDay of state.days) {
    if (aptDay.name === day) {
      daysArray.push(aptDay);
    }
  }

  if (daysArray === [] || !day || daysArray[0] === undefined) {
    return [];
  }

  const aptArr = daysArray[0].appointments;

  const dayApts = [];

  for (const appointment of Object.values(state.appointments)) {
    if (aptArr.includes(appointment.id)) {
      dayApts.push(appointment);
    }
  }
  return dayApts;
}
function getInterview(state, interview) {
  if (interview === null || !interview) {
    return null;
  }

  for (const interviewer of Object.values(state.interviewers)) {
    if (interview.interviewer === interviewer.id) {
      return { student: interview.student, interviewer: interviewer };
    }
  }
}

module.exports = {
  getAppointmentsForDay,
  getInterview
};