import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import JobCard from "./JobCard";
import UserContext from "./UserContext";
import JoblyApi from "./api";

export default function Company() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [company, setCompany] = useState({});
  const [jobs, setJobs] = useState([]);
  const { handle } = useParams();

  

  const applyHandler = (id) => {
    JoblyApi.applyToJob(currentUser.username, id).then(() => {
      JoblyApi.getCurrentUser(currentUser.username).then((updatedUser) => {
        setCurrentUser(updatedUser);
      });
    });
  };

  const checkAppliedFor = (id) => {
    if (currentUser.applications !== undefined && currentUser.applications !== null) {
      if (currentUser.applications.indexOf(id) >= 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  useEffect(() => {
    async function getCompany() {
      console.log(handle);
      let company = await JoblyApi.getCompany(handle);
      console.log(company);
      setCompany(company);
      setJobs(company.jobs);
      setIsLoading(false);
    }
    getCompany();
  }, [handle]);

  if (isLoading) {
    return <p>Loading &hellip;</p>;
  }
  return (
    <Container className="mt-5">
      <Row className="justify-content-center pt-3">
        <Col md={8}>
          <h4 className="mt-5">{company.name}</h4>
          <p>{company.description}</p>
          {jobs.map((job) => (
            <JobCard
              appliedFor={checkAppliedFor(job.id)}
              applyHandler={applyHandler}
              equity={job.equity}
              id={job.id}
              key={job.id}
              salary={job.salary}
              title={job.title}
            />
          ))}
          {jobs === [] && <p>No Jobs Found</p>}
        </Col>
      </Row>
    </Container>
  );
}
