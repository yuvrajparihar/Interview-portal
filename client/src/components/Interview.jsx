
function Interview(props) {

    console.log(props.start_time);
  function handleDelete() {
    var url = "http://localhost:5000/";

    fetch(url + "delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ delete_id: props.interview_id }),
    })
      .then((response) => response.json())
      .then((data) => {
      
        props.getInterviewList();
      });
  }
  function handleEdit()
  {
      props.toggleEditSchedule(props);
  }

  var date = new Date(props.start_time);
  const sum= parseInt (date.getMonth())+parseInt(1)
  var curDate =    date.getDate() + "-" + sum + "-" + date.getFullYear();
  var startMinute=date.getMinutes();
  if(startMinute<10)
  {
    startMinute= "0"+startMinute
  }
  var startTime = date.getHours() + ":" + startMinute;
  
  date = new Date(props.end_time);
  var endMinute=date.getMinutes();

  if(endMinute <10)
  {
    endMinute= "0"+endMinute;
  }
  var endTime = date.getHours() + ":" + endMinute
  // var endTime = date.getHours() + ":" + endTime;

  return (
    <div className="interview-container">
      <div className="s-no">
        <h4>{props.ind}</h4>
      </div>
      <div className="interviewer-container">
        {props.interviewer_name.map((item) => (
          <h4>{item}</h4>
        ))}
      </div>
      <div className="interviewee-container">
        {props.candidate_name.map((item) => (
          <h4>{item}</h4>
        ))}
      </div>
      <div className="interview-date">
        <h3>{curDate}</h3>
      </div>
      <div className="interview-starttime">
        <h3>{startTime}</h3>
      </div>
      <div className="interview-endtime">
        <h3>{endTime}</h3>
      </div>
      <div className="interview-buttons">
        <button className="edit-button" onClick={handleEdit}>Edit</button>
        <button className="delete-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Interview;
