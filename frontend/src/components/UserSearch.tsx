import React, { useState, useEffect } from "react";
import { TextField, CircularProgress, useTheme } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import api, { API_SEARCH_USERS } from "api";
import { useDebounce } from "use-debounce";
import AvatarTag from "./AvatarTag";
import { Avatar } from "types";
import AvatarOption from "./AvatarOption";
import { css } from "@emotion/core";

export interface UserOption {
  id: number;
  username: string;
  avatar: Avatar | null;
}

interface Props {
  boardId: number;
  tagsValue: UserOption[];
  setTagsValue: (val: UserOption[]) => void;
}

const UserSearch = ({ boardId, tagsValue, setTagsValue }: Props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<UserOption[]>([]);
  const [debouncedInput] = useDebounce(inputValue, 300, {
    equalityFn: (a, b) => a === b,
  });

  useEffect(() => {
    if (!open) {
      setOptions([]);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (inputValue) {
      setLoading(true);
    }
  }, [inputValue]);

  useEffect(() => {
    const source = api.CancelToken.source();

    const fetchData = async () => {
      try {
        const response = await api(
          `${API_SEARCH_USERS}?board=${boardId}&search=${inputValue}`,
          { cancelToken: source.token }
        );
        setLoading(false);
        setOptions(response.data);
      } catch (err) {
        if (!api.isCancel(err)) {
          console.error(err);
        }
      }
    };

    if (inputValue === "") {
      setLoading(false);
      setOptions([]);
    } else {
      fetchData();
    }

    return () => {
      source.cancel("unmount/debouncedInput changed");
    };
  }, [debouncedInput, tagsValue]);

  useEffect(() => {
    if (debouncedInput === inputValue) {
      setLoading(false);
    }
  }, [debouncedInput, inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleTagsChange = (_event: React.ChangeEvent<{}>, newValues: any) => {
    setTagsValue(newValues);
    setOptions([]);
  };

  return (
    <Autocomplete
      multiple
      id="user-search"
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionSelected={(option, value) => option.username === value.username}
      getOptionLabel={(option) => option.username}
      filterSelectedOptions
      onChange={handleTagsChange}
      options={options}
      loading={loading}
      value={tagsValue}
      renderOption={(option) => <AvatarOption option={option} />}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus
          label="Search username"
          variant="outlined"
          onChange={handleInputChange}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <AvatarTag
            key={option.id}
            option={option}
            {...getTagProps({ index })}
          />
        ))
      }
      css={css`
        width: ${theme.breakpoints.down("xs") ? 200 : 300}px;
      `}
    />
  );
};

export default UserSearch;
