import { useEffect, useState } from "react";
import Interview from "./Interview";
import React from "react";
import CreateSchedule from "./CreateSchedule";
import { Button } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchInterviewList } from "../Api";
import EditSchedule from "./EditSchedule";

function Home() {
  const [showCreateSchedule, setCreateSchedule] = useState(false);
  const [showEditSchedule, setEditSchedule] = useState(false);

  const [items, setItems] = useState([]);

  function toggleCreateSchedule() {
    setCreateSchedule(!showCreateSchedule);
  }
   const [previousData,setPreviousData]=useState();
  function toggleEditSchedule(data) {
    console.log("data ",data)
    setPreviousData(data)
    setEditSchedule(!showEditSchedule);
  }
  async function getInterviewList() {
    const res = await fetchInterviewList();
    // console.log(res);
    setItems(res.Response);
  }

  useEffect(() => {
    getInterviewList();
  }, []);
 
  return (
    <div>
      <div className="list-header"></div>
      <div className="create-schedule">
        {showCreateSchedule ? (
          <CreateSchedule
            getInterviewList={getInterviewList}
            toggleCreateSchedule={toggleCreateSchedule}
            showCreateSchedule={showCreateSchedule}
          />
        ) : null}

       
      </div>
      <div className="Edit-schedule">
        {showEditSchedule ? (
          <EditSchedule
            previousData={previousData}
            getInterviewList={getInterviewList}
            toggleEditSchedule={toggleEditSchedule}
            showEditSchedule={showEditSchedule}
          />
        ) : null}

        
      </div>
      <div className="heading">
          <h4 className="heading-sno">S.No</h4>
          <h4 className="heading-interviewer">Interviewer</h4>
          <h4 className="heading-candidate">Candidate</h4>
          <h4 className="heading-date">Date</h4>
          <h4 className="heading-start">Start-Time</h4>
          <h4 className="heading-end">End-Time</h4>
          <Button
          color="primary"
          onClick={toggleCreateSchedule}
          className="create-button"
        >
          Schedule Interview
        </Button>
      </div>
      <hr></hr>
      <div className="list-container">
        {items.map((item, index) => {
          return (
            <Interview
              ind={index + 1}
              interview_id={item.i_id}
              start_time={item.start_time}
              end_time={item.end_time}
              candidate_id={item.candidate_id}
              candidate_name={item.candidate_name}
              interviewer_id={item.interviewer_id}
              interviewer_name={item.interviewer_name}
              getInterviewList={getInterviewList}
              toggleEditSchedule={toggleEditSchedule}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Home;
