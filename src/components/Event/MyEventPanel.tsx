import {
  Stack,
  Table,
  Text,
  createStyles,
  Group,
  ActionIcon,
  Loader,
  Title,
  Modal,
  Button,
} from "@mantine/core";
import { getDuration, getFormattedDate } from "../../utils/dateHandler";
import { trpc } from "../../utils/trpc";
import {
  MdEdit,
  MdOutlineDelete,
  MdSentimentDissatisfied,
} from "react-icons/md";
import Image from "next/image";
import { defaultEventImage } from "../../types/constant";
import useDeleteEvent from "../../hooks/useDeleteEvent";
import { useState } from "react";
import { EventPost } from "@prisma/client";

const useStyles = createStyles((theme) => ({
  tableContainer: {
    fontWeight: 500,
    color: theme.colors.dark[9],
    background: theme.colors.background?.[0],
    //boxShadow: `${theme.colors.secondary?.[9]} 0px 8px 24px`,

    thead: {
      tr: {
        background: theme.colors.gray[1],
      },
    },
  },
  overWrappingText: {
    wordBreak: "break-all",
  },
}));

function MyEventPanel() {
  const { classes } = useStyles();
  const { data, isLoading } = trpc.eventPost.getMyEvent.useQuery();
  const [opened, setOpened] = useState(false);
  const [eventDetail, setDetailEvent] = useState<EventPost>();
  const { deleteEvent, disable } = useDeleteEvent();
  const handleOnClick = (eventId: EventPost) => {
    setOpened(true);
    setDetailEvent(eventId);
  };
  // });

  if (isLoading) {
    return (
      <Group position="center" m="10vw">
        <Loader size={"xl"} variant="oval" color={"gold"} />
        <Title order={2} color={"gold"}>
          Loading Events
        </Title>
      </Group>
    );
  }

  const rows = data?.map((event, index) => {
    return (
      <tr key={event.id} className={classes.overWrappingText}>
        <td>
          <Text align="center">{++index}</Text>
        </td>
        <td>
          <Image
            src={event.image ? event.image : defaultEventImage}
            alt={event.title}
            width="100"
            height="100"
          />
        </td>
        <td>{event.title}</td>
        <td>
          {event.description ? (
            event.description
          ) : (
            <Text color="red">Description is not available for this event</Text>
          )}
        </td>
        <td>{event.venue}</td>
        <td>{getFormattedDate(event.date)}</td>
        <td>{getDuration(event.timeStart, event.timeEnd)}</td>
        <td>
          <Group noWrap>
            <ActionIcon variant="transparent" color="green">
              <MdEdit size={50} />
            </ActionIcon>
            <ActionIcon
              // onClick={() => deleteEvent(event.id)}
              onClick={() => handleOnClick(event)}
              variant="transparent"
              color="red"
            >
              <MdOutlineDelete size={50} />
            </ActionIcon>
          </Group>
        </td>
      </tr>
    );
  });

  console.log(data?.length);
  return (
    <>
      {data && data.length ? (
        <>
          <Modal
            centered
            opened={opened}
            withCloseButton={false}
            onClose={() => setOpened(false)}
          >
            <Stack align="center">
              <Image
                src={eventDetail?.image ? eventDetail?.image : ""}
                alt={""}
                width="340"
                height="220"
              />
              <Title order={2} align="center">
                {eventDetail?.title}
              </Title>
              <Text weight={500} align="center">
                Are you sure you want to delete this event?
              </Text>
              <Group position="center">
                {eventDetail && (
                  <Button
                    onClick={() => deleteEvent(eventDetail?.id)}
                    disabled={disable}
                    color="red"
                  >
                    Yes
                  </Button>
                )}

                <Button onClick={() => setOpened(false)} color="gray">
                  Cancel
                </Button>
              </Group>
            </Stack>
          </Modal>

          <Stack m="xl" spacing="xl">
            <Table
              className={classes.tableContainer}
              verticalSpacing="lg"
              horizontalSpacing="lg"
              withColumnBorders={true}
              withBorder={true}
            >
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Sample Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Stack>
        </>
      ) : (
        <Stack m="auto" w="35%" spacing="xl" p="3vw" align="center">
          <MdSentimentDissatisfied color="pink" size={"250"} />
          <Title color="pink.2" order={2} align="center">
            Uh Oh, It seems you don't have any events running.
          </Title>
        </Stack>
      )}
    </>
  );
}

export default MyEventPanel;
