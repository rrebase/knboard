import React from "react";
import { Button } from "@material-ui/core";
import { N80A, N900 } from "utils/colors";
import { ITask } from "types";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { css } from "@emotion/core";
import { jake } from "data";
import TaskEditor from "./TaskEditor";

const AddTask = () => {
  const [adding, setAdding] = React.useState<boolean>(false);
  const newTask: ITask = { id: 999, title: "", author: jake, description: "" };

  return (
    <>
      {adding ? (
        <TaskEditor
          task={newTask}
          setEditing={() => null}
          text=""
          setText={() => null}
          adding
        />
      ) : (
        <Button
          css={css`
            text-transform: inherit;
            color: ${N80A};
            padding: 4px 0;
            margin-top: 6px;
            margin-bottom: 6px;
            &:hover {
              color: ${N900};
            }
            .MuiButton-iconSizeMedium > *:first-of-type {
              font-size: 12px;
            }
          `}
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          fullWidth
          onClick={() => setAdding(true)}
        >
          Add another card
        </Button>
      )}
    </>
  );
};

export default AddTask;
