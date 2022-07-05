import { AnyAction } from 'redux';
import {
  addPullRequestAlreadyNotified,
  addWarning,
  cleanWarnings,
  organizationPreferencesReducer,
  removeWarning,
  savePreferences,
  State,
} from './organizationPreferencesSlice';

describe('store organization preferences slice tests', () => {
  it('initially the slice with the right state', async () => {
    const globalState = organizationPreferencesReducer(
      undefined,
      {} as AnyAction,
    );

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.enabled).toStrictEqual(false);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add warning repository identifier', async () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr-other'],
      enabled: true,
      preferences: undefined,
    };
    const globalState = organizationPreferencesReducer(
      previousState,
      addWarning('hi-pr'),
    );

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual(['hi-pr-other', 'hi-pr']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add repeated warning repository identifier', async () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr'],
      enabled: true,
      preferences: undefined,
    };
    const globalState = organizationPreferencesReducer(
      previousState,
      addWarning('hi-pr'),
    );

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual(['hi-pr']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('remove warning repository identifier', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr', 'hi-pr-other'],
      enabled: true,
      preferences: undefined,
    };
    const globalState = organizationPreferencesReducer(
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
      enabled: true,
      preferences: undefined,
    };
    const globalState = organizationPreferencesReducer(
      previousState,
      removeWarning('diff'),
    );

    expect(globalState.preferences).toBeUndefined();
    expect(globalState.warnings).toStrictEqual(['hi-pr', 'hi-pr-other']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('clean warnings state', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: ['hi-pr', 'hi-pr-other'],
      enabled: true,
      preferences: {
        username: 'nbentoneves',
        teamname: 'my-team',
        organization: {
          name: 'hi-pr-org',
          token: 'token',
        },
        repositories: ['hi-pr'],
      },
    };

    const globalState = organizationPreferencesReducer(
      previousState,
      cleanWarnings(),
    );

    expect(globalState.warnings).toStrictEqual(['hi-pr']);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add a pull request id already notified', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: ['100'],
      warnings: [],
      enabled: true,
      preferences: undefined,
    };
    const globalState = organizationPreferencesReducer(
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

  it('save preferences', () => {
    const previousState: State = {
      pullRequestsAlreadyNotified: [],
      warnings: [],
      enabled: true,
      preferences: undefined,
    };

    const preferences = {
      username: 'nbentoneves',
      teamname: 'my-team',
      organization: {
        name: 'hi-pr-org',
        token: 'token',
      },
      repositories: ['hi-pr', 'hi-pr-other'],
    };

    const globalState = organizationPreferencesReducer(
      previousState,
      savePreferences(preferences),
    );

    expect(globalState.preferences).toStrictEqual(preferences);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });
});
