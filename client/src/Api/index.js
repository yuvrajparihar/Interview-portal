export const fetchInterviewList = async () => {
  var res;
  var url = "http://localhost:5000/";
  await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
        res=data;
      //  console.log("response data", data.Response);
      // setItems(data.Response);
      
    });
    return res;
};
