import { AnyAction } from 'redux';
import {
  addPullRequestAlreadyNotified,
  addWarning,
  cleanWarnings,
  globalReducer,
  removeWarning,
  savePreferences,
  State,
} from './globalSlice';

describe('global slice tests', () => {
  it('initially the global slice with the right state', async () => {
    const globalState = globalReducer(undefined, {} as AnyAction);

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add warning repository identifier', async () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr-other'],
      preferences: undefined,
    };
    const globalState = globalReducer(previousState, addWarning('hi-pr'));

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual(['hi-pr-other', 'hi-pr']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add repeated warning repository identifier', async () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr'],
      preferences: undefined,
    };
    const globalState = globalReducer(previousState, addWarning('hi-pr'));

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual(['hi-pr']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('remove warning repository identifier', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr', 'hi-pr-other'],
      preferences: undefined,
    };
    const globalState = globalReducer(
      previousState,
      removeWarning('hi-pr-other'),
    );

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual(['hi-pr']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('remove warning repository identifier not present in array', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr', 'hi-pr-other'],
      preferences: undefined,
    };
    const globalState = globalReducer(previousState, removeWarning('diff'));

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual(['hi-pr', 'hi-pr-other']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('clean warnings state', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr', 'hi-pr-other'],
      preferences: {
        username: 'nbentoneves',
        organization: {
          owner: 'hi-pr-org',
          token: 'token',
          teamname: 'my-team',
        },
        repositories: ['hi-pr'],
      },
    };

    const globalState = globalReducer(previousState, cleanWarnings());

    expect(globalState.warnings).toStrictEqual(['hi-pr']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add a pull request id already notified', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: ['100'],
      warnings: [],
      preferences: undefined,
    };
    const globalState = globalReducer(
      previousState,
      addPullRequestAlreadyNotified('200'),
    );

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([
      '100',
      '200',
    ]);
  });

  it('save a preferences', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: [],
      preferences: undefined,
    };

    const preferences = {
      username: 'nbentoneves',
      organization: {
        owner: 'hi-pr-org',
        token: 'token',
        teamname: 'my-team',
      },
      repositories: ['hi-pr', 'hi-pr-other'],
    };

    const globalState = globalReducer(
      previousState,
      savePreferences(preferences),
    );

    expect(globalState.preferences).toStrictEqual(preferences);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });
});
