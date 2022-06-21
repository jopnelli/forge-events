import styled from "styled-components";

const Grid = styled.div``;

const Row = styled.div`
  display: flex;
`;

const Col = styled.div`
  flex: 1;
  border-style: solid;
  border-color: black;
  padding: 20px;
  margin: 10px;
`;

function EventList() {
  return (
    <div className="App">
      <h1>Responsive Grid</h1>
      <Grid>
        <Row>
          <Col>Row 1 Column 1</Col>
          <Col>Row 1 Column 2</Col>
        </Row>
        <Row>
          <Col>Row 2 Column 1</Col>
          <Col>Row 2 Column 2</Col>
        </Row>
      </Grid>
    </div>
  );
}
export default EventList;
