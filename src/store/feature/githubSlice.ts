import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { GITHUB_CONFIGURATIONS } from '../constants';

const GITHUB = 'github';

// Define a type for the slice state
export type Configuration = {
  identifier: string;
  name: string;
  enabled: boolean;
  username: string;
  teamname?: string;
  organization?: {
    name: string;
    // TODO: Encrypt token
    token: string;
  };
  repositories: string[];
};

export type Warning = {
  identifier: string;
  repositories: string[];
};

export type State = {
  type: string;
  pullRequestsAlreadyNotified: string[];
  warnings: Array<Warning>;
  configurations: Array<Configuration>;
};

// Define the initial state using that type
const initialState: State = {
  type: GITHUB,
  pullRequestsAlreadyNotified: [],
  warnings: [],
  configurations: [],
};

const slice = createSlice({
  name: GITHUB_CONFIGURATIONS,
  initialState,
  reducers: {
    switchEnabled: (state, action: PayloadAction<string>) => {
      const config = state.configurations.find(
        (it) => it.identifier === action.payload,
      );

      if (config) {
        config.enabled = !config.enabled;
      }
    },
    addWarning: (
      state,
      action: PayloadAction<{ identifier: string; repository: string }>,
    ) => {
      const warning = state.warnings.find(
        (warn) => warn.identifier === action.payload.identifier,
      );

      if (warning) {
        if (
          !warning.repositories.find(
            (repository) => repository === action.payload.repository,
          )
        ) {
          warning.repositories.push(action.payload.repository);
        }
      } else {
        const listOfRepositories = [action.payload.repository];
        state.warnings.push({
          identifier: action.payload.identifier,
          repositories: listOfRepositories,
        });
      }
    },
    removeWarning: (
      state,
      action: PayloadAction<{ identifier: string; repository: string }>,
    ) => {
      const warning = state.warnings.find(
        (warn) => warn.identifier === action.payload.identifier,
      );

      if (warning) {
        const repositories = _.remove(
          warning.repositories,
          (repo) => repo !== action.payload.repository,
        );

        warning.repositories = repositories;
      }
    },
    cleanWarning: (state, action: PayloadAction<{ identifier: string }>) => {
      state.warnings = _.remove(
        state.warnings,
        (warnings) => warnings.identifier !== action.payload.identifier,
      );
    },
    addPullRequestAlreadyNotified: (state, action: PayloadAction<string>) => {
      state.pullRequestsAlreadyNotified = [
        ...state.pullRequestsAlreadyNotified,
        action.payload,
      ];
    },
    saveConfiguration: (state, action: PayloadAction<Configuration>) => {
      state.configurations.push(action.payload);
    },
    editConfiguration: (state, action: PayloadAction<Configuration>) => {
      const configurationIndex = state.configurations.findIndex(
        (it) => it.identifier === action.payload.identifier,
      );

      if (configurationIndex !== -1) {
        state.configurations[configurationIndex] = action.payload;
      }
    },
  },
});

export const {
  switchEnabled,
  addWarning,
  removeWarning,
  cleanWarning,
  addPullRequestAlreadyNotified,
  saveConfiguration,
  editConfiguration,
} = slice.actions;

export const { reducer: githubReducer } = slice;
