import {
    Stack,
    TextInput,
    Title,
    createStyles,
    Textarea,
    Select,
    Group,
    Button,
    Divider,
    Paper,
    ScrollArea,
  } from "@mantine/core";
  import { DatePicker, TimeInput } from "@mantine/dates";
  import { FileWithPath } from "@mantine/dropzone";
  import { GetInputProps } from "@mantine/form/lib/types";
  import React, { Dispatch, FormSalesHandler, SetStateAction } from "react";
  import { allVenues } from "../../data/venues";
  import { SalesPostInput } from "../../schema/salesPost.schema";
  import FileDropzone from "./SalesDropzone";
  
  const useStyle = createStyles((theme) => ({
    container: {
      marginLeft: "10vw",
      border: "1px solid",
      borderRadius: "10px",
      borderColor: theme.colors.dark?.[9],
      backgroundColor: theme.colors.primary?.[2],
    },
    innerContainer: {
      background: theme.colors.background?.[0],
    },
  }));
  
  type Props = {
    setFiles: Dispatch<SetStateAction<FileWithPath[]>>;
    getInputProps: GetInputProps<{
      image?: string | undefined;
      title: string;
      description: string;
      venue: string;
      date: Date;
      timeStart: Date;
      timeEnd: Date;
    }>;
    submit: () => FormSalesHandler<HTMLFormElement> | undefined;
    values: SalesPostInput;
    disable: boolean;
  };
  
  function CreateSales({ setFiles, submit, getInputProps, disable }: Props) {
    const { classes } = useStyle();
  
    return (
      <Paper shadow="xs" p="xs" className={classes.container}>
        <form onSubmit={submit()}>
          <Stack
            p="md"
            spacing="xs"
            justify="center"
            className={classes.innerContainer}
          >
            <Title order={2}>Fill Sales Details</Title>
            <Divider />
            <TextInput
              label={"Sales Title"}
              placeholder="E.g. Marathon"
              withAsterisk
              {...getInputProps("title")}
            />
            <Textarea
              label={"Description"}
              placeholder="Explain what's it about."
              minRows={3}
              {...getInputProps("description")}
            />
            <Group grow>
              <Select
                searchable
                label={"Venue"}
                data={
                  allVenues?.map(({ venue }) => ({
                    label: venue,
                    value: venue,
                  })) || []
                }
                withAsterisk
                {...getInputProps("venue")}
              />
              <DatePicker
                label={"Date"}
                withAsterisk
                onChange={(e) => {
                  console.log(e);
                }}
                {...getInputProps("date")}
              />
            </Group>
  
            <Group grow>
              <TimeInput
                label="Start"
                format="12"
                amLabel="am"
                pmLabel="pm"
                withAsterisk
                {...getInputProps("timeStart")}
              />
              <TimeInput
                onChange={(e) => {
                  console.log(e.getHours());
                }}
                label="End"
                format="12"
                amLabel="am"
                pmLabel="pm"
                withAsterisk
                {...getInputProps("timeEnd")}
              />
            </Group>
            <FileDropzone setFiles={setFiles} />
            <Button type="submit" color={"primary.0"} disabled={disable}>
              Submit Sales
            </Button>
          </Stack>
        </form>
      </Paper>
    );
  }
  
  export default CreateSales;