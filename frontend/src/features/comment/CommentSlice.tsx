import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import api, { API_COMMENTS } from "api";
import { AxiosResponse } from "axios";
import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from "features/toast/ToastSlice";
import { RootState } from "store";
import { Id, NewTaskComment, Status, TaskComment } from "types";

export const fetchComments = createAsyncThunk<TaskComment[], number>(
  "comment/fetchCommentsStatus",
  async (taskId, { dispatch }) => {
    try {
      const response: AxiosResponse<TaskComment[]> = await api.get(
        `${API_COMMENTS}?task=${taskId}`
      );
      return response.data;
    } catch (err) {
      dispatch(createErrorToast(err.message));
      return [];
    }
  }
);

export const createComment = createAsyncThunk<
  TaskComment | undefined,
  NewTaskComment
>("comment/createCommentStatus", async (comment, { dispatch }) => {
  try {
    const response: AxiosResponse<TaskComment> = await api.post(
      API_COMMENTS,
      comment
    );
    dispatch(createSuccessToast("Comment posted"));
    return response.data;
  } catch (err) {
    dispatch(createErrorToast(err.message));
  }
});

export const deleteComment = createAsyncThunk<Id | undefined, Id>(
  "task/deleteCommentStatus",
  async (id, { dispatch }) => {
    try {
      await api.delete(`${API_COMMENTS}${id}/`);
      dispatch(createInfoToast("Comment deleted"));
      return id;
    } catch (err) {
      dispatch(createErrorToast(err.message));
    }
  }
);

const commentAdapter = createEntityAdapter<TaskComment>({
  sortComparer: (a, b) => b.created.localeCompare(a.created),
});

interface ExtraInitialState {
  fetchCommentsStatus: Status;
  createCommentStatus: Status;
}

export const initialState = commentAdapter.getInitialState<ExtraInitialState>({
  fetchCommentsStatus: "idle",
  createCommentStatus: "idle",
});

export const slice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.fetchCommentsStatus = "loading";
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      commentAdapter.addMany(state, action.payload);
      state.fetchCommentsStatus = "succeeded";
    });
    builder.addCase(createComment.pending, (state) => {
      state.createCommentStatus = "loading";
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      commentAdapter.addOne(state, action.payload as TaskComment);
      state.createCommentStatus = "succeeded";
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      commentAdapter.removeOne(state, action.payload as Id);
    });
  },
});

// selectors
export const { selectAll: selectAllComments } = commentAdapter.getSelectors(
  (state: RootState) => state.comment
);
export const selectFetchCommentsStatus = (state: RootState) =>
  state.comment.fetchCommentsStatus;
export const selectCreateCommentStatus = (state: RootState) =>
  state.comment.createCommentStatus;

export default slice.reducer;
