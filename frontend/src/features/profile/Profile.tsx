import React from "react";
import {
  Container,
  Divider,
  TextField,
  Avatar,
  Button
} from "@material-ui/core";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetail, fetchAvatarList, updateUser } from "./ProfileSlice";
import { RootState } from "store";
import { css } from "@emotion/core";
import { useForm } from "react-hook-form";

const Title = styled.h3`
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`;

const FormContainer = styled.div`
  margin-top: 2rem;
  display: flex;
`;

const AvatarContainer = styled.div`
  margin: 3rem;
`;

const Row = styled.div``;

const UserForm = styled.form`
  width: 100%;
`;

const Fields = styled.div``;

interface FormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

const Profile = () => {
  const dispatch = useDispatch();
  const userDetail = useSelector(
    (state: RootState) => state.profile.userDetail
  );
  const apiErrors = useSelector((state: RootState) => state.profile.apiErrors);
  const loading = useSelector((state: RootState) => state.profile.loading);
  const { register, errors, handleSubmit, setError } = useForm<FormData>({
    mode: "onChange"
  });

  React.useEffect(() => {
    dispatch(fetchUserDetail());
    dispatch(fetchAvatarList());
  }, []);

  React.useEffect(() => {
    if (apiErrors) {
      for (const errorKey in apiErrors) {
        // @ts-ignore
        setError(errorKey, "api_error", apiErrors[errorKey]);
      }
    }
  }, [apiErrors]);

  if (!userDetail) {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    dispatch(updateUser({ ...userDetail, ...data }));
  };

  return (
    <Container maxWidth="sm">
      <Title>About</Title>
      <Divider />
      <FormContainer>
        <AvatarContainer>
          <Avatar
            css={css`
              height: 6rem;
              width: 6rem;
              font-size: 36px;
            `}
          />
        </AvatarContainer>
        <UserForm onSubmit={handleSubmit(onSubmit)}>
          <Fields>
            <Row>
              <TextField
                id="username"
                name="username"
                inputRef={register({ required: "This field is required" })}
                defaultValue={userDetail.username}
                helperText={errors.username?.message}
                error={Boolean(errors.username)}
                label="Username"
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Row>
            <Row>
              <TextField
                id="first_name"
                name="first_name"
                inputRef={register()}
                defaultValue={userDetail.first_name}
                helperText={errors.first_name?.message}
                error={Boolean(errors.first_name)}
                label="First name"
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Row>
            <Row>
              <TextField
                id="last_name"
                name="last_name"
                inputRef={register()}
                defaultValue={userDetail.last_name}
                helperText={errors.last_name?.message}
                error={Boolean(errors.last_name)}
                label="Last name"
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Row>
            <Row>
              <TextField
                id="email"
                name="email"
                inputRef={register({
                  required: "This field is required",
                  pattern: {
                    value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Invalid email"
                  }
                })}
                defaultValue={userDetail.email}
                helperText={errors.email?.message}
                error={Boolean(errors.email)}
                label="Email"
                variant="outlined"
                margin="dense"
                fullWidth
              />
            </Row>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              css={css`
                margin-top: 1rem;
                text-align: right;
              `}
            >
              Save
            </Button>
          </Fields>
        </UserForm>
      </FormContainer>
      {/* <div style={{ width: 300, marginLeft: 500 }}>
        {avatars.map((avatar: any, index: number) => (
          <span
            key={index}
            css={css`
              margin-left: 0.5rem;
              display: none;
            `}
          >
            <img src={avatar.photo} alt="batimg" width={40} height={40} />
          </span>
        ))}
      </div> */}
    </Container>
  );
};

export default Profile;
