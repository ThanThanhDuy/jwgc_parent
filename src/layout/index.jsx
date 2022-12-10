import React from "react";
import { Col, Row } from "reactstrap";
import Content from "../components/Content";
import Header from "../components/Header";
import "./index.scss";

function Layout() {
  return (
    <div>
      <Header />
      <Row>
        <Col xs="12">
          <Content />
        </Col>
      </Row>
    </div>
  );
}

export default Layout;
