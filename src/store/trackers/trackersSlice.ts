import { createSlice, SerializedError } from '@reduxjs/toolkit';

import Tracker from '../../models/Tracker';
import SliceStatus from '../../models/SliceStatus';

// ===== State

export interface TrackersState {
  error: SerializedError;
  status: SliceStatus;
  trackers?: Tracker[];
}

const initialState: TrackersState = {
  error: {},
  status: SliceStatus.idle,
  trackers: undefined
};

// ===== Thunk

// export const fetchAllTrackers = createAsyncThunk('trackers/fetchAllTrackers', async () => {
//   const response = await TrackersActions.fetchAll();
//   return response.data;
// });

// ===== Reducers

export const trackersSlice = createSlice({
  name: 'trackers',
  initialState,
  reducers: {}
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  // extraReducers: () => {}
});

export default trackersSlice.reducer;
