import React from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import "./CompanyCard.css";

export default function CompanyCard(props) {
  const { handle, name, description } = props;
  return (
    <Link to={`/companies/${handle}`}>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title className="d-inline-block">{name}</Card.Title>
          <Image
            className="d-inline-block ml-auto"
            src="https://cdn.pixabay.com/photo/2018/04/12/14/03/silhouette-3313481_1280.png"
            alt={`Logo for ${name}`}
          />
          <Card.Text className="d-inline-block">{description}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}
