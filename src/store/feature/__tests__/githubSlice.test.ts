import { AnyAction } from 'redux';
import {
  addPullRequestAlreadyNotified,
  addWarning,
  cleanWarning,
  Configuration,
  deleteConfiguration,
  editConfiguration,
  githubReducer,
  removeWarning,
  saveConfiguration,
  State,
  switchEnabled,
} from '../githubSlice';

describe('store github configuration slice tests', () => {
  const previousState: State = {
    type: 'github',
    pullRequestsAlreadyNotified: [],
    warnings: [
      {
        identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        repositories: ['hi-pr-other'],
      },
    ],
    configurations: [],
  };

  const defaultConfiguration0: Configuration = {
    identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
    enabled: true,
    name: 'github-1',
    username: 'nbentoneves',
    owner: 'hi-pr-org',
    organization: {
      teamname: 'my-team',
      token: 'token',
    },
    repositories: ['hi-pr', 'hi-pr-other'],
  };

  const defaultConfiguration1: Configuration = {
    identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
    enabled: true,
    name: 'github-1',
    username: 'nbentoneves',

    owner: 'hi-pr-org',
    organization: {
      teamname: 'my-team',
      token: 'token',
    },
    repositories: ['hi-pr', 'hi-pr-other'],
  };

  it('initially the slice with the right state', async () => {
    const globalState = githubReducer(undefined, {} as AnyAction);

    expect(globalState.configurations).toStrictEqual([]);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add warning repository when identifier already exists', async () => {
    const globalState = githubReducer(
      previousState,
      addWarning({
        identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        repository: 'hi-pr',
      }),
    );

    expect(globalState.configurations).toStrictEqual([]);
    expect(globalState.warnings.length).toBe(1);
    expect(globalState.warnings).toStrictEqual([
      {
        identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        repositories: ['hi-pr-other', 'hi-pr'],
      },
    ]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add another warning repository when identifier not exist', async () => {
    const globalState = githubReducer(
      {
        ...previousState,
        warnings: [
          {
            identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
            repositories: ['hi-pr'],
          },
        ],
      },
      addWarning({
        identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
        repository: 'hi-pr-other',
      }),
    );

    expect(globalState.configurations).toStrictEqual([]);
    expect(globalState.warnings.length).toBe(2);
    expect(globalState.warnings).toStrictEqual([
      {
        identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        repositories: ['hi-pr'],
      },
      {
        identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
        repositories: ['hi-pr-other'],
      },
    ]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('remove warning repository identifier', () => {
    const globalState = githubReducer(
      {
        ...previousState,
        warnings: [
          {
            identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
            repositories: ['hi-pr'],
          },
          {
            identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
            repositories: ['hi-pr', 'hi-pr-other'],
          },
        ],
      },
      removeWarning({
        identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
        repository: 'hi-pr-other',
      }),
    );

    expect(globalState.configurations).toStrictEqual([]);
    expect(globalState.warnings).toStrictEqual([
      {
        identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        repositories: ['hi-pr'],
      },
      {
        identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
        repositories: ['hi-pr'],
      },
    ]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('remove warning repository identifier not present in array', () => {
    const globalState = githubReducer(
      {
        ...previousState,
        warnings: [
          {
            identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
            repositories: ['hi-pr'],
          },
          {
            identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
            repositories: ['hi-pr', 'hi-pr-other'],
          },
        ],
      },
      removeWarning({
        identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
        repository: 'diff',
      }),
    );

    expect(globalState.configurations).toStrictEqual([]);
    expect(globalState.warnings).toStrictEqual([
      {
        identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        repositories: ['hi-pr'],
      },
      {
        identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
        repositories: ['hi-pr', 'hi-pr-other'],
      },
    ]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('clean warning repository identifier', () => {
    const globalState = githubReducer(
      {
        ...previousState,
        warnings: [
          {
            identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
            repositories: ['hi-pr'],
          },
          {
            identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
            repositories: ['hi-pr', 'hi-pr-other'],
          },
        ],
      },
      cleanWarning({
        identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
      }),
    );

    expect(globalState.configurations).toStrictEqual([]);
    expect(globalState.warnings).toStrictEqual([
      {
        identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
        repositories: ['hi-pr'],
      },
    ]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add a pull request id already notified', () => {
    const globalState = githubReducer(
      {
        ...previousState,
        pullRequestsAlreadyNotified: ['100'],
        warnings: [],
      },
      addPullRequestAlreadyNotified('200'),
    );

    expect(globalState.configurations).toStrictEqual([]);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([
      '100',
      '200',
    ]);
  });

  it('save configuration', () => {
    const globalState = githubReducer(
      {
        ...previousState,
        pullRequestsAlreadyNotified: [],
        warnings: [],
        configurations: [],
      },
      saveConfiguration(defaultConfiguration0),
    );

    expect(globalState.configurations[0]).toStrictEqual(defaultConfiguration0);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('switch enable', () => {
    const globalState = githubReducer(
      {
        ...previousState,
        warnings: [],
        configurations: [
          {
            ...defaultConfiguration0,
            enabled: false,
          },
        ],
      },
      switchEnabled('9edfd955-da4b-444f-8897-40a19d5bd13d'),
    );

    expect(globalState.configurations.length).toEqual(1);
    expect(globalState.configurations[0].enabled).toBeTruthy();
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('save configuration', () => {
    const globalState = githubReducer(
      {
        ...previousState,
        warnings: [],
      },
      saveConfiguration(defaultConfiguration0),
    );

    expect(globalState.configurations[0]).toStrictEqual(defaultConfiguration0);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('update configuration', () => {
    const newConfiguration: Configuration = {
      identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
      enabled: false,
      name: 'github-1',
      username: 'new-nbentoneves',
      owner: 'hi-pr-org',
      organization: {
        teamname: 'my-team',
        token: 'token',
      },
      repositories: ['hi-pr', 'hi-pr-other'],
    };

    const globalState = githubReducer(
      {
        ...previousState,
        warnings: [],
        configurations: [defaultConfiguration0, defaultConfiguration1],
      },
      editConfiguration(newConfiguration),
    );

    expect(globalState.configurations.length).toEqual(2);
    expect(globalState.configurations[1]).toStrictEqual(newConfiguration);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('delete configuration', () => {
    const globalState = githubReducer(
      {
        ...previousState,
        warnings: [],
        configurations: [defaultConfiguration0, defaultConfiguration1],
      },
      deleteConfiguration('b205e4ba-1d8e-4e25-89ad-00dbc35959f7'),
    );

    expect(globalState.configurations.length).toEqual(1);
    expect(globalState.configurations[0]).toStrictEqual(defaultConfiguration0);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });
});
