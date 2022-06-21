import styled from "styled-components";
import React, { Fragment, useState } from "react";
import { useAsyncFn } from "react-use";
import { createEvent } from "shared/api";
import LoadingButton from "@atlaskit/button/loading-button";

function App() {
  const [createEventState, createNewEvent] = useAsyncFn(() => {
    return createEvent({
      name: "test event name",
      description: "this is an event description.",
    });
  }, []);
  return (
    <LoadingButton
      onClick={createNewEvent}
      isLoading={createEventState.loading}
    >
      test
    </LoadingButton>
  );
}

export default App;

// const App = () => {
//   const [isOpenModal, setOpenModal] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [currentUser, setCurrentUser] = useState("");

//   return (
//     <Fragment>
//       <Button
//         text="Create Event"
//         icon="add-circle"
//         onClick={() => setOpenModal(true)}
//       />
//       {/* <User accountId={currentUser} /> */}
//       <Text>{currentUser}</Text>
//       <EventList events={events} setOpenModal={setOpenModal} />
//       <EventForm
//         events={events}
//         setEvents={setEvents}
//         isOpenModal={isOpenModal}
//         setOpenModal={setOpenModal}
//         setCurrentUser={setCurrentUser}
//       />
//     </Fragment>
//   );
// };
