const express = require("express");
const mysqlConnnection = require("./connection");
const cors = require("cors");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  mysqlConnnection.query(
    "SELECT interview_id AS i_id,(SELECT start_time FROM interview WHERE interview_id=i_id) AS start_time,(SELECT end_time FROM\
       interview WHERE interview_id=i_id) AS end_time ,group_concat(candidate.candidate_id) AS candidate_id, group_concat(candidate.candidate_name) AS candidate_name\
        FROM candidate_interview JOIN candidate ON candidate_interview.candidate_id=candidate.candidate_id GROUP BY  interview_id;",
    function (err, rows, field) {
      if (err) {
        console.log(err);
      } else {
        // console.log(rows);
        mysqlConnnection.query(
          "SELECT interview_id, group_concat(interviewer.interviewer_id) AS interviewer_id, group_concat(interviewer.interviewer_name)\
             AS interviewer_name FROM interviewer JOIN interviewer_interview  ON interviewer.interviewer_id=interviewer_interview.interviewer_id\
              GROUP BY  interview_id;",
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              for (key in rows) {
                rows[key].interviewer_id =
                  result[key].interviewer_id.split(",");
                // console.log(typeof(rows[key].interviewer_id))
                rows[key].interviewer_name =
                  result[key].interviewer_name.split(",");
                rows[key].candidate_name = rows[key].candidate_name.split(",");
                rows[key].candidate_id = rows[key].candidate_id.split(",");
              }
              res.send({ Response: rows });
            }
          }
        );

      }
    }
  );

});

app.get("/list", function (req, res) {
  mysqlConnnection.query(
    "SELECT interviewer_id as value,interviewer_name as label FROM interviewer",
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        mysqlConnnection.query(
          "SELECT candidate_id as value,candidate_name as label FROM candidate",
          function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.send({ interviewer: rows, candidate: result });
            }
          }
        );
      }
    }
  );
});

app.post("/delete", function (req, res) {
  const delete_id = req.body.delete_id;
  // console.log(delete_id);
  mysqlConnnection.query(
    "DELETE FROM interviewer_interview WHERE interview_id=?",
    [delete_id],
    function (err) {
      if (err) {
        console.log(err);
      } else {
        mysqlConnnection.query(
          "DELETE FROM candidate_interview WHERE interview_id=?",
          [delete_id],
          function (err) {
            if (err) {
              console.log(err);
            } else {
              mysqlConnnection.query(
                "DELETE FROM interview WHERE interview_id=?",
                [delete_id],
                function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send({ isDeleted: true });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.post("/create", function (req, res) {
//  var check_id= req.body.interviewer_id
  mysqlConnnection.query(
    "SELECT interviewer_id FROM interview JOIN interviewer_interview on interviewer_interview.interview_id=interview.interview_id\
       WHERE interviewer_id IN (?) AND((start_time<? AND end_time>=?) OR (start_time<=? AND end_time>?))",
    [
      req.body.newInterviewer,
      req.body.endTime,
      req.body.endTime,
      req.body.startTime,
      req.body.startTime,
    ],
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        if (rows.length > 0) {
          mysqlConnnection.query(
            "SELECT interviewer_name FROM interviewer WHERE interviewer_id=?",
            [rows[0].interviewer_id],
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
                res.send({
                  isCollision: true,
                  displayName: result[0].interviewer_name,
                });
              }
            }
          );
        } else {
          mysqlConnnection.query(
            "SELECT candidate_id FROM interview JOIN candidate_interview on candidate_interview.interview_id=interview.interview_id\
               WHERE candidate_id IN (?) AND ((start_time<? AND end_time>=?) OR (start_time<=? AND end_time>?))",
            [
              req.body.newCandidate,
              req.body.endTime,
              req.body.endTime,
              req.body.startTime,
              req.body.startTime,
            ],
            function (err, cand_id) {
              if (err) {
                console.log(err);
              } else {
                if (cand_id.length > 0) {
                  mysqlConnnection.query(
                    "SELECT candidate_name FROM candidate WHERE candidate_id=?",
                    [cand_id[0].candidate_id],
                    function (err, cand_name) {
                      if (err) {
                        console.log(err);
                      } else {
                        res.send({
                          isCollision: true,
                          displayName: cand_name[0].candidate_name,
                        });
                      }
                    }
                  );
                } else {
              
                  mysqlConnnection.query(
                    "INSERT INTO interview (start_time,end_time) VALUES(?,?)",
                    [req.body.startTime, req.body.endTime],
                    function (err, inserted) {
                      if (err) {
                        console.log(err);
                      } else {
                        mysqlConnnection.query(
                          "SELECT MAX(interview_id) as l_id FROM interview",
                          function (err, last_id) {
                            if (err) {
                              console.log(err);
                            } else {
                              var insertValues = [];
                              var interviewer = req.body.newInterviewer;
                              for (key in interviewer) {
                                insertValues.push([
                                  interviewer[key],
                                  last_id[0].l_id
                                ]);
                              }
                              mysqlConnnection.query(
                                "INSERT INTO interviewer_interview VALUES ?",
                                [insertValues],
                                function (err, newIntw) {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    var insertValue = [];
                                    var candidate = req.body.newCandidate;
                                    for (key in candidate) {
                                      insertValue.push([
                                        candidate[key],
                                        last_id[0].l_id,
                                      ]);
                                    }
                                    mysqlConnnection.query(
                                      "INSERT INTO Candidate_interview VALUES ?",
                                      [insertValue],
                                      function (err, newCand) {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                          res.send({ isCollision: false });
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  );
});

app.post("/edit", function (req, res) {

  var delete_id = req.body.interview_id;
  mysqlConnnection.query(
    "SELECT interviewer_id FROM interview JOIN interviewer_interview on interviewer_interview.interview_id=interview.interview_id\
       WHERE interviewer_id IN (?) AND interview.interview_id!=? AND  ((start_time<? AND end_time>=?) OR (start_time<=? AND end_time>?))",
    [
      req.body.newInterviewer,
      delete_id,
      req.body.endTime,
      req.body.endTime,
      req.body.startTime,
      req.body.startTime,
    ],
    function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        if (rows.length > 0) {
          
          mysqlConnnection.query(
            "SELECT interviewer_name FROM interviewer WHERE interviewer_id=?",
            [rows[0].interviewer_id],
            function (err, result) {
              if (err) {
                console.log(err);
              } else {
               
                res.send({
                  isCollision: true,
                  displayName: result[0].interviewer_name,
                });
              }
            }
          );
        } else {
          mysqlConnnection.query(
            "SELECT candidate_id FROM interview JOIN candidate_interview on candidate_interview.interview_id=interview.interview_id\
               WHERE candidate_id IN (?) AND interview.interview_id!=? AND ((start_time<? AND end_time>=?) OR (start_time<=? AND end_time>?))",
            [
              req.body.newCandidate,
              delete_id,
              req.body.endTime,
              req.body.endTime,
              req.body.startTime,
              req.body.startTime,
            ],
            function (err, cand_id) {
              if (err) {
                console.log(err);
              } else {
                if (cand_id.length > 0) {
                  
                  mysqlConnnection.query(
                    "SELECT candidate_name FROM candidate WHERE candidate_id=?",
                    [cand_id[0].candidate_id],
                    function (err, cand_name) {
                      if (err) {
                        console.log(err);
                      } else {
                        // console.log(rows,result)
                        res.send({
                          isCollision: true,
                          displayName: cand_name[0].candidate_name,
                        });
                      }
                    }
                  );
                } else {
                  mysqlConnnection.query(
                    "DELETE FROM interviewer_interview WHERE interview_id= ?",
                    [delete_id],
                    function (err) {
                      if (err) {
                        console.log(err);
                      } else {
                        mysqlConnnection.query(
                          "DELETE FROM candidate_interview WHERE interview_id =?",
                          [delete_id],
                          function (err) {
                            if (err) {
                              console.log(err);
                            } else {
                              mysqlConnnection.query(
                                "DELETE FROM interview WHERE interview_id =?",
                                [delete_id],
                                function (err) {
                                  if (err) {
                                    console.log(err);
                                  } else {
                                    mysqlConnnection.query(
                                      "INSERT INTO interview (start_time,end_time) VALUES(?,?)",
                                      [req.body.startTime, req.body.endTime],
                                      function (err, inserted) {
                                        if (err) {
                                          console.log(err);
                                        } else {
                                          mysqlConnnection.query(
                                            "SELECT MAX(interview_id) as l_id FROM interview",
                                            function (err, last_id) {
                                              if (err) {
                                                console.log(err);
                                              } else {
                                                var insertValues = [];
                                                var interviewer =
                                                  req.body.newInterviewer;
                                                for (key in interviewer) {
                                                  insertValues.push([interviewer[key],last_id[0].l_id,]);
                                                }
                                               
                                                mysqlConnnection.query(
                                                  "INSERT INTO interviewer_interview VALUES ?",
                                                  [insertValues],
                                                  function (err, newIntw) {
                                                    if (err) {
                                                      console.log(err);
                                                    } else {
                                                      var insertValue = [];
                                                      var candidate =
                                                        req.body.newCandidate;
                                                      for (key in candidate) {
                                                        insertValue.push([
                                                          candidate[key],
                                                          last_id[0].l_id,
                                                        ]);
                                                      }
                                                      mysqlConnnection.query(
                                                        "INSERT INTO Candidate_interview VALUES ?",
                                                        [insertValue],
                                                        function (err,newCand) {
                                                          if (err) {
                                                            console.log(err);
                                                          } else {
                                                            res.send({
                                                              isCollision: false,
                                                            });
                                                          }
                                                        }
                                                      );
                                                    }
                                                  }
                                                );
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  );
});

app.listen(5000, function (req, res) {
  console.log("server is listening on 5000");
});
