import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { ORGANIZATION_PREFERENCES } from '../constants';

// Define a type for the slice state
export type Preferences = {
  username?: string;
  teamname?: string;
  organization?: {
    name: string;
    // TODO: Encrypt token
    token: string;
  };
  repositories: string[];
};

export type State = {
  pullRequestsAlreadyNotified: string[];
  warnings: string[];
  enabled: boolean;
  preferences?: Preferences;
};

// Define the initial state using that type
const initialState: State = {
  pullRequestsAlreadyNotified: [],
  warnings: [],
  enabled: false,
  preferences: undefined,
};

const slice = createSlice({
  name: ORGANIZATION_PREFERENCES,
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
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
  setEnabled,
  addWarning,
  removeWarning,
  cleanWarnings,
  addPullRequestAlreadyNotified,
  savePreferences,
} = slice.actions;

export const { reducer: organizationPreferencesReducer } = slice;
