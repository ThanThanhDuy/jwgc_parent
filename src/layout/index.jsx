import React from "react";
import { Col, Row } from "reactstrap";
import Content from "../components/Content";
import Header from "../components/Header";
import "./index.scss";

function Layout() {
  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <Header />
      <Row
        style={{
          margin: 0,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Col xs="12" style={{ marginTop: "56px", padding: 0 }}>
          <Content />
        </Col>
      </Row>
    </div>
  );
}

export default Layout;
