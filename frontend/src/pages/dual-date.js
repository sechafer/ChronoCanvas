import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import MultiDateEntry from "../components/multidate-entry";
import { useFetchOnDemand } from "../api-access/get-ai-data-on-demand";
import DataDisplay from "../components/data-display";
import LoadingSpinner from "../components/loading-spinner";
import PaintApp from "../components/paint";
import SvgDisplay from "../components/svg-display";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintbrush, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function DualDateComparison() {
  const navigate = useNavigate(); // Initialize navigation

  // Left column: state and API hook
  const {
    data: leftData,
    loading: leftLoading,
    error: leftError,
    setBirthDate: setLeftBirthDate,
  } = useFetchOnDemand();
  const [leftDate, setLeftDate] = useState(null);

  // Right column: state and API hook
  const {
    data: rightData,
    loading: rightLoading,
    error: rightError,
    setBirthDate: setRightBirthDate,
  } = useFetchOnDemand();
  const [rightDate, setRightDate] = useState(null);

  // Set today's date on initial render for both sides, but don't trigger API calls.
  useEffect(() => {
    const today = new Date();
    const formattedToday = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(
      today.getDate()
    ).padStart(2, "0")}/${today.getFullYear()}`;
    setLeftDate(formattedToday);
    setRightDate(formattedToday);
  }, []);

  // Only trigger API calls when the user clicks the Paint button.
  const handleSubmit = () => {
    if (leftDate) {
      setLeftBirthDate(leftDate);
    }
    if (rightDate) {
      setRightBirthDate(rightDate);
    }
  };

  // Show a spinner if either side is loading
  if (leftLoading || rightLoading) return <LoadingSpinner />;

  return (
    <>
      {/* Back Button Positioned in Top Left */}
      <div style={{position: 'absolute', top: '230px', left: '30px'}}>
        <Button onClick={() => navigate("/")} className="text-light fw-bold">
          <FontAwesomeIcon icon={faChevronLeft} className="me-2" /> Back
        </Button>
      </div>

      <div className="header-background text-center">
        <h1 className="text-light fst-italic fw-bold mt-5 mb-0">
          Compare Your Days!
        </h1>
        <small className="d-block">
          Select two dates to see your unique “paintings” side by side.
        </small>
      </div>

      {/* Button at the top that triggers handleSubmit */}
      <div className="text-center mt-3 p-3">
        <Button onClick={handleSubmit} className="submit-button p-3">
          <FontAwesomeIcon icon={faPaintbrush} /> Paint!
        </Button>
      </div>

      <Container className="my-5">
        <Row>
          {/* Left Side */}
          <Col md={6} className="pr-md-3">
            <MultiDateEntry
              onDateSelect={(date) => {
                setLeftDate(date);
              }}
            />
            {leftError && <p className="text-danger text-center">{leftError}</p>}
            {leftData && leftDate && (
              <>
                <h2 className="text-center mt-2 mb-5 squiggle-underline">
                  <FontAwesomeIcon icon={faPaintbrush} /> <b>{leftDate}</b>{" "}
                  <span className="fw-bold">Painted!</span>
                </h2>
                <Row className="g-3">
                  <Col lg={12}>
                    <SvgDisplay
                      title="Your ChronoCanvas"
                      image={leftData.svg}
                      imgDescription={<span>{leftData.imgDescription}</span>}
                      descriptionStyle={{ top: "94%" }}
                    />
                  </Col>
                  <Col lg={6}>
                    <DataDisplay
                      title="Birthstone"
                      name={leftData.birthstone}
                      description={leftData.birthstoneSymbol}
                    />
                  </Col>
                  <Col lg={6}>
                    <DataDisplay
                      title="Western Zodiac Sign"
                      name={leftData.zodiac}
                      description={leftData.zodiacSymbol}
                    />
                  </Col>
                  <Col lg={6}>
                    <DataDisplay
                      title="Chinese Zodiac Sign"
                      name={leftData.chineseZodiac}
                      description={`Element: ${leftData.chineseZodiacElement}`}
                    />
                  </Col>
                  <Col lg={6}>
                    <DataDisplay
                      title="Birth Flower"
                      name={leftData.birthFlower}
                      description={leftData.birthFlowerSymbol}
                      descriptionStyle={{ top: "90%" }}
                    />
                  </Col>
                </Row>
              </>
            )}
            <PaintApp />
          </Col>

          {/* Right Side with a vertical divider */}
          <Col md={6} className="border-start border-dark ps-md-3">
            <MultiDateEntry
              onDateSelect={(date) => {
                setRightDate(date);
              }}
            />
            {rightError && <p className="text-danger text-center">{rightError}</p>}
            {rightData && rightDate && (
              <>
                <h2 className="text-center mt-2 mb-5 squiggle-underline">
                  <FontAwesomeIcon icon={faPaintbrush} /> <b>{rightDate}</b>{" "}
                  <span className="fw-bold">Painted!</span>
                </h2>
                <Row className="g-3">
                  <Col lg={12}>
                    <SvgDisplay
                      title="Your ChronoCanvas"
                      image={rightData.svg}
                      imgDescription={<span>{rightData.imgDescription}</span>}
                      descriptionStyle={{ top: "94%" }}
                    />
                  </Col>
                  <Col lg={6}>
                    <DataDisplay
                      title="Birthstone"
                      name={rightData.birthstone}
                      description={rightData.birthstoneSymbol}
                    />
                  </Col>
                  <Col lg={6}>
                    <DataDisplay
                      title="Western Zodiac Sign"
                      name={rightData.zodiac}
                      description={rightData.zodiacSymbol}
                    />
                  </Col>
                  <Col lg={6}>
                    <DataDisplay
                      title="Chinese Zodiac Sign"
                      name={rightData.chineseZodiac}
                      description={`Element: ${rightData.chineseZodiacElement}`}
                    />
                  </Col>
                  <Col lg={6}>
                    <DataDisplay
                      title="Birth Flower"
                      name={rightData.birthFlower}
                      description={rightData.birthFlowerSymbol}
                      descriptionStyle={{ top: "90%" }}
                    />
                  </Col>
                </Row>
              </>
            )}
            <PaintApp />
          </Col>
        </Row>
      </Container>
    </>
  );
}
