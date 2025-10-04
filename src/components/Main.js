import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import "../styles/colors.css";

export default function Main() {
  return (
    <section className="col-12 col-md-9">
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {/* Example Recipe Card 1 */}
        <Col>
          <Card className="h-100">
            <Card.Img
              variant="top"
              src="/assets/images/placeholder.svg"
              alt="Spaghetti Bolognese"
            />
            <Card.Body>
              <Card.Title>Spaghetti Bolognese</Card.Title>
              <Card.Text>
                <span className="fw-bold">25g</span>{" "}
                <span className="text-muted">• 1.5k sold</span>
              </Card.Text>
              <Card.Text className="small">
                ⭐⭐⭐⭐☆ <span className="ms-2 text-muted">342</span>
              </Card.Text>
              <Button
                size="sm"
                className="btn-ct-primary"
                data-bs-toggle="modal"
                data-bs-target="#getModal"
              >
                Get
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Example Recipe Card 2 */}
        <Col>
          <Card className="h-100">
            <Card.Img
              variant="top"
              src="/assets/images/placeholder.svg"
              alt="Vegan Salad"
            />
            <Card.Body>
              <Card.Title>Vegan Salad</Card.Title>
              <Card.Text>
                <span className="fw-bold">FREE</span>{" "}
                <span className="text-muted">• 980 sold</span>
              </Card.Text>
              <Card.Text className="small">
                ⭐⭐⭐☆☆ <span className="ms-2 text-muted">210</span>
              </Card.Text>
              <Button
                size="sm"
                className="btn-ct-primary"
                data-bs-toggle="modal"
                data-bs-target="#getModal"
              >
                Get
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Example Recipe Card 3 */}
        <Col>
          <Card className="h-100">
            <Card.Img
              variant="top"
              src="/assets/images/placeholder.svg"
              alt="Sushi Platter"
            />
            <Card.Body>
              <Card.Title>Sushi Platter</Card.Title>
              <Card.Text>
                <span className="fw-bold">50g</span>{" "}
                <span className="text-muted">• 2.3k sold</span>
              </Card.Text>
              <Card.Text className="small">
                ⭐⭐⭐⭐⭐ <span className="ms-2 text-muted">540</span>
              </Card.Text>
              <Button
                size="sm"
                className="btn-ct-primary"
                data-bs-toggle="modal"
                data-bs-target="#getModal"
              >
                Get
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Load more button */}
      <div className="d-grid gap-2 col-6 mx-auto my-4">
        <Button variant="outline-primary">Load more</Button>
      </div>
    </section>
  );
}