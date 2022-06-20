import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { GLOBAL } from '../constants';

// Define a type for the slice state
type Preferences = {
  username?: string;
  organization?: {
    owner: string;
    // TODO: Encrypt token
    token: string;
    teamname?: string;
  };
  repositories: string[];
};

export type State = {
  pullRequestsAlreadyNotified: string[];
  warnings: string[];
  preferences?: Preferences;
};

// Define the initial state using that type
const initialState: State = {
  pullRequestsAlreadyNotified: [],
  warnings: [],
  preferences: undefined,
};

const slice = createSlice({
  name: GLOBAL,
  initialState,
  reducers: {
    addWarning: (state, action: PayloadAction<string>) => {
      if (!state.warnings.find((warn) => warn === action.payload)) {
        state.warnings = [...state.warnings, action.payload];
      }
    },
    removeWarning: (state, action: PayloadAction<string>) => {
      state.warnings = _.remove(
        state.warnings,
        (warn) => warn !== action.payload,
      );
    },
    cleanWarnings: (state) => {
      state.warnings = _.remove(
        state.warnings,
        (warn) =>
          state.preferences &&
          !!state.preferences.repositories.find(
            (repository) => repository === warn,
          ),
      );
    },
    addPullRequestAlreadyNotified: (state, action: PayloadAction<string>) => {
      state.pullRequestsAlreadyNotified = [
        ...state.pullRequestsAlreadyNotified,
        action.payload,
      ];
    },
    savePreferences: (state, action: PayloadAction<Preferences>) => {
      state.preferences = action.payload;
    },
  },
});

export const {
  addWarning,
  removeWarning,
  cleanWarnings,
  addPullRequestAlreadyNotified,
  savePreferences,
} = slice.actions;

export const { reducer: globalReducer } = slice;
