function getAppointmentsForDay(state, day) {
  const daysArray = state.days.filter(thisDay => thisDay.name === day);

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
const getInterviewersForDay = (state, day) => {
  const filteredDays = state.days.filter(stateDay => day === stateDay.name);
  if (!(filteredDays !== [] && day && filteredDays[0])) {
    return [];
  }
  const { appointments } = filteredDays[0];
  const interviewers = [];

  for (const appointment of Object.values(state.appointments)) {
    if (!appointments.includes(appointment.id) && appointment.interview) {
      const interviewer = appointment.interview.interviewer.toString();
      if (!interviewers.includes(state.interviewers[interviewer])) {
        interviewers.push(state.interviewers[interviewer]);
      }
    }
  }
  return interviewers;
};

module.exports = {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
};