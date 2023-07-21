import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import JobCard from "./JobCard";
import SearchForm from "./SearchForm";
import UserContext from "./UserContext";
import JoblyApi from "./api";

export default function Jobs() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ search: "" });

  

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((fdata) => ({
      ...fdata,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const searchResults = await JoblyApi.getJobs(formData.search);
    setJobs(searchResults);
    setFormData({ search: "" });
  };

  const applyHandler = (id) => {
    JoblyApi.applyToJob(currentUser.username, id).then(() => {
      JoblyApi.getCurrentUser(currentUser.username).then((updatedUser) => {
          setCurrentUser(updatedUser);
      })
    });
  };

  const checkAppliedFor = (id) => {
    if (
      currentUser.applications !== undefined &&
      currentUser.applications !== null
    ) {
      if (currentUser.applications.indexOf(id) >= 0) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  };

  const getJobs = () => {
    JoblyApi.getJobs().then((companies) => {
      setJobs(companies);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    if (formData === undefined || formData == null) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    getJobs();
  }, []);

  if (isLoading) {
    return <p>Loading &hellip;</p>;
  }
  return (
    <Container className="mt-5">
      <Row className="justify-content-center pt-3">
        <Col md={8}>
          <SearchForm
            changeHandler={changeHandler}
            submitHandler={submitHandler}
            formData={formData}
          />


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