import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import DateTimePicker from "react-datetime-picker";

function CreateSchedule(props) {

  const [interviewerData, setInterviewerData] = useState([]);
  const [candidateData,setCandidateData]=useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedInterviewer, setInterviewer] = useState([]);
  const [selectedCandidate, setCandidate] = useState([]);
  const [isError,setError]= useState(false);
  const [errorMessage,setErrorMessage]=useState();
  var url = "http://localhost:5000/";
  useEffect(() => {
    
    fetch(url+"list", {
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


  function handleSubmit()
  {
      // console.log(value)
      if(selectedInterviewer.length<1)
      {
        setErrorMessage("Interviewer field cannot be empty")
        setError(!isError);
      }
      else if(selectedCandidate.length<1)
      {
        setErrorMessage("Candidate field cannot be empty")
        setError(!isError);
      }
      else
      {
        var date= new Date(startTime)
        var st_time= date.getTime()
        date= new Date(endTime)
        var en_time= date.getTime();
        fetch(url+"create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          
          },
          body: JSON.stringify({ 
                                 startTime:st_time,
                                  endTime:en_time,
                                 newInterviewer:selectedInterviewer,
                                 newCandidate:selectedCandidate  }),
        })
          .then((response) => response.json())
          .then((data) => {
          //   setstate(data)
            if(data.isCollision)
            {
              setErrorMessage(data.displayName+" is having another interview in this duration.")
              setError(!isError);
            }
            else
            {
  
              setErrorMessage("Interview Created")
              setError(!isError)
              props.getInterviewList();
              // setItems([...Items,{}])
              props.toggleCreateSchedule()           
            }
          });
      }


  }

  const handleInterviewer = (e) => {
    if(isError)
      {
        setError(!isError)

      }
    // se
    setInterviewer(Array.isArray(e) ? e.map((x) => x.value) : []);
  };
  const handleCandidate = (e) => {
    if(isError)
      {
        setError(!isError)

      }
    // se

    setCandidate(Array.isArray(e) ? e.map((x) => x.value) : []);
  };



  
  function handleDateChange(e) {
    if(isError)
      {
        setError(!isError)

      }

    setStartTime(e);
 
  }
  function handleEndDateChange(e) {
    if(isError)
      {
        setError(!isError)

      }
    // se
    // setEndTime(false)

   
    setEndTime(e);
    // console.log(e)
   
  }



  return (
    <div className="createSchedule-container">
      <Modal
        toggle={props.toggleCreateSchedule}
        isOpen={props.showCreateSchedule}
      >
        <ModalHeader toggle={props.toggleCreateSchedule}>
          Schedule Interview
        </ModalHeader>
        <ModalBody>
         
          <h3>Select Interviewer</h3>
          <Select
            isMulti
            name="colors"
            value={interviewerData.filter((obj) => selectedInterviewer.includes(obj.value))}
            onChange={handleInterviewer}
            options={interviewerData}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <h3>Select Candidate</h3>
          <Select
            isMulti
            name="colors"
            value={candidateData.filter((obj) => selectedCandidate.includes(obj.value))}
            onChange={handleCandidate}
            options={candidateData}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <div>
          <h4>Select start time</h4>
            <DateTimePicker value={startTime} onChange={handleDateChange} />
            <h4>Select end time</h4>
            <DateTimePicker value={endTime} onChange={handleEndDateChange} />
          </div>
          {isError?<p className="error">{" "+errorMessage}</p>:null}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Create
          </Button>{" "}
          <Button onClick={props.toggleCreateSchedule}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default CreateSchedule;
