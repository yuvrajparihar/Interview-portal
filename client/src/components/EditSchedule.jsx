import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";

function EditSchedule(props) {

  const [interviewerData, setInterviewerData] = useState([]);
  const [candidateData, setCandidateData] = useState([]);
  const [value, setValue] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedInterviewer, setInterviewer] = useState([]);
  const [selectedCandidate, setCandidate] = useState([]);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  var url = "http://localhost:5000/";

  var defaultInterviewerData = [];
  var defaultCandidateData = [];
  var defaultCandidate = [];
  var defaultInterviewer = [];
  useEffect(() => {
    var startTime = props.previousData.start_time;
    var endTime = props.previousData.end_time;

    startTime = new Date(startTime);
    endTime = new Date(endTime);
    setValue(startTime);
    setEndTime(endTime);

    for (let key = 0; key < props.previousData.interviewer_id.length; key++) {
      defaultInterviewerData.push({
        value: props.previousData.interviewer_id[key],
        label: props.previousData.interviewer_name[key],
      });
      defaultInterviewer.push(parseInt(props.previousData.interviewer_id[key]));
    }
    for (let key = 0; key < props.previousData.candidate_id.length; key++) {
      defaultCandidateData.push({
        value: props.previousData.candidate_id[key],
        label: props.previousData.candidate_name[key],
      });
      defaultCandidate.push(parseInt(props.previousData.candidate_id[key]));
    }
    setInterviewer(defaultInterviewer);
    setCandidate(defaultCandidate);
    fetch(url + "list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //  console.log( data.Response);
        setInterviewerData(data.interviewer);
        setCandidateData(data.candidate);
      });
  }, []);

  function handleSubmit() {
    if (selectedInterviewer.length < 1) {
      setErrorMessage("Interviewer field cannot be empty");
      setError(!isError);
    } else if (selectedCandidate.length < 1) {
      setErrorMessage("Candidate field cannot be empty");
      setError(!isError);
    } else {
      var date = new Date(value);
      var st_time = date.getTime();
      date = new Date(endTime);
      var en_time = date.getTime();
      fetch(url + "edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
          interview_id: props.previousData.interview_id,
          startTime: st_time,
          endTime: en_time,
          newInterviewer: selectedInterviewer,
          newCandidate: selectedCandidate,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          //   setstate(data)
          if (data.isCollision) {
            setErrorMessage(
              data.displayName +
                " is having another interview in this duration."
            );
            setError(!isError);
          } else {
            setErrorMessage("Interview Created");
            setError(!isError);
            props.getInterviewList();
            props.toggleEditSchedule();
          }
        });
    }
  }

  const handleInterviewer = (e) => {
    if (isError) {
      setError(!isError);
    }
    // setEndTime(false)
    setInterviewer(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  const handleCandidate = (e) => {
    // setEndTime(false)
    if (isError) {
      setError(!isError);
    }
    setCandidate(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  function handleDateChange(e) {
    if (isError) {
      setError(!isError);
    }

    setValue(e);
  }
  function handleEndDateChange(e) {
    if (isError) {
      setError(!isError);
    }

    setEndTime(e);
  }

  return (
    <div className="createSchedule-container">
      <Modal toggle={props.toggleEditSchedule} isOpen={props.showEditSchedule}>
        <ModalHeader toggle={props.toggleEditSchedule}>
          Modify Interview
        </ModalHeader>
        <ModalBody>
          <h3>Select Interviewer</h3>
          <Select
            isMulti
            name="colors"
            defaultValue={defaultInterviewerData}
            value={interviewerData.filter((obj) =>
              selectedInterviewer.includes(obj.value)
            )}
            onChange={handleInterviewer}
            options={interviewerData}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <h3>Select Candidate</h3>
          <Select
            isMulti
            name="colors"
            defaultValue={defaultCandidateData}
            value={candidateData.filter((obj) =>
              selectedCandidate.includes(obj.value)
            )}
            onChange={handleCandidate}
            options={candidateData}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <div>
            <h4>Select start time</h4>
            <DateTimePicker value={value} onChange={handleDateChange} />
            <h4>Select end time</h4>
            <DateTimePicker value={endTime} onChange={handleEndDateChange} />
          </div>
          {isError ? <p className="error">{errorMessage}</p> : null}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Modify
          </Button>{" "}
          <Button onClick={props.toggleEditSchedule}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default EditSchedule;
