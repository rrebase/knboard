import React, { useState, useEffect } from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import api, { API_USERS } from "api";

interface UserOption {
  id: number;
  url: string;
  username: string;
  email: string;
}

interface Props {
  inputEl: React.RefObject<HTMLInputElement>;
  boardId: number;
}

const UserSearch = ({ inputEl, boardId }: Props) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = React.useState<UserOption[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return;
    }

    (async () => {
      const response = await api(`${API_USERS}?excludemembers=${boardId}`);
      const users = response.data;

      if (active) {
        setOptions(users as UserOption[]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="user-search"
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionSelected={(option, value) => option.username === value.username}
      getOptionLabel={option => option.username}
      options={options}
      loading={loading}
      style={{ width: 250 }}
      renderInput={params => (
        <TextField
          {...params}
          label="Search username"
          variant="outlined"
          inputRef={inputEl}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  );
};

export default UserSearch;
