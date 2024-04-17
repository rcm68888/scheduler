import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  prettyDOM,
  queryByAltText,
  queryByText,
  waitForElement
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Application from "components/Application";
import axios from "../../__mocks__/axios";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen"));
    // 3. Click the "Add" button on the booked appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    // 5. Click the first interviewer in the list
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Click the "Save" button on that same appointment
    // console.log(prettyDOM(appointment));
    // 7. Check that the element with the test "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 8.  Wait until the element with the text "Lydia Miller-Jones" is displayed
    await findByText(appointment, "Lydia Miller-Jones"));
    // 9.  Check that the DayListItem with the text "Monday"
    //expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    // due to implementation of web sockets to update spots remaining, this test will fail as decsribed
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await findByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Delete the appointment?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    // This test will fail due to the implementation of sockets to update the spots remaining
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

    it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
      // 1. Render the Application.
      const { container } = render(<Application />);
  
      // 2. Wait until the text "Archie Cohen" is displayed.
      await waitForElement(() => getByText(container, "Archie Cohen"));
  
      // 3. Click the "Edit" button on the booked appointment.
      const appointment = getAllByTestId(container, "appointment").find appointment => queryByText(appointment, "Archie Cohen"));
  
      fireEvent.click(queryByAltText(appointment, "Edit"));
  
      // update appointment to new student
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" }
      });
  
      fireEvent.click(getByText(appointment, "Save"));
  
      expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
      console.log(prettyDOM(container));
      // wait for appointments to render and find updated appointment
      await waitForElement(() => getByText(container, "Lydia Miller-Jones"));
  
      const day = getAllByTestId(container, "day").find(day =>
        queryByText(day, "Monday")
      );
      expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // 3. Click the Add button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Add"));
    // 4. Change the content of the appointment
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Cohana Roy"));

    // 5. Click the "Save" button
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() =>
      getByText(appointment, "Error saving. Please try again.")
    );

    //6. Check that the error message "Error saving. Please try again." is displayed.
    expect(
      queryByText(appointment, "Error saving. Please try again.")
    ).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Delete the appointment?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    await waitForElement(() =>
      getByText(appointment, "Error deleting. Please try again.")
    );
    console.log(prettyDOM(appointment));
    // 6. Check that the error message "Error deleting. Please try again." is displayed.
    expect(
      getByText(appointment, "Error deleting. Please try again.")
    ).toBeInTheDocument();
  });
});
