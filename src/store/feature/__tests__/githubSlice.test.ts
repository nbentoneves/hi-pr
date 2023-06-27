import { AnyAction } from 'redux';
import {
  addPullRequestAlreadyNotified,
  addWarning,
  cleanWarning,
  Configuration,
  editConfiguration,
  githubReducer,
  removeWarning,
  saveConfiguration,
  State,
  switchEnabled,
} from '../githubSlice';

describe('store github configuration slice tests', () => {
  it('initially the slice with the right state', async () => {
    const globalState = githubReducer(undefined, {} as AnyAction);

    expect(globalState.configurations).toStrictEqual([]);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('add warning repository when identifier already exists', async () => {
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
    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: [],
      warnings: [
        {
          identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
          repositories: ['hi-pr'],
        },
      ],
      configurations: [],
    };
    const globalState = githubReducer(
      previousState,
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
    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: [],
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
      configurations: [],
    };
    const globalState = githubReducer(
      previousState,
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
    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: [],
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
      configurations: [],
    };
    const globalState = githubReducer(
      previousState,
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
    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: [],
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
      configurations: [],
    };
    const globalState = githubReducer(
      previousState,
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
    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: ['100'],
      warnings: [],
      configurations: [],
    };
    const globalState = githubReducer(
      previousState,
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
    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: [],
      warnings: [],
      configurations: [],
    };

    const configuration: Configuration = {
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

    const globalState = githubReducer(
      previousState,
      saveConfiguration(configuration),
    );

    expect(globalState.configurations[0]).toStrictEqual(configuration);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('switch enable', () => {
    const preference0: Configuration = {
      identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
      enabled: false,
      name: 'github-1',
      username: 'nbentoneves',
      owner: 'hi-pr-org',
      organization: {
        teamname: 'my-team',
        token: 'token',
      },
      repositories: ['hi-pr', 'hi-pr-other'],
    };

    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: [],
      warnings: [],
      configurations: [preference0],
    };

    const globalState = githubReducer(
      previousState,
      switchEnabled('9edfd955-da4b-444f-8897-40a19d5bd13d'),
    );

    expect(globalState.configurations.length).toEqual(1);
    expect(globalState.configurations[0].enabled).toBeTruthy();
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('save configuration', () => {
    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: [],
      warnings: [],
      configurations: [],
    };

    const configuration: Configuration = {
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

    const globalState = githubReducer(
      previousState,
      saveConfiguration(configuration),
    );

    expect(globalState.configurations[0]).toStrictEqual(configuration);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });

  it('update configuration', () => {
    const preference0: Configuration = {
      identifier: '9edfd955-da4b-444f-8897-40a19d5bd13d',
      enabled: true,
      name: 'github-0',
      username: 'nbentoneves',
      owner: 'hi-pr-org',
      organization: {
        teamname: 'my-team',
        token: 'token',
      },
      repositories: ['hi-pr', 'hi-pr-other'],
    };

    const preference1: Configuration = {
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

    const previousState: State = {
      type: 'github',
      pullRequestsAlreadyNotified: [],
      warnings: [],
      configurations: [preference0, preference1],
    };

    const newPreference: Configuration = {
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
      previousState,
      editConfiguration(newPreference),
    );

    expect(globalState.configurations.length).toEqual(2);
    expect(globalState.configurations[1]).toStrictEqual(newPreference);
    expect(globalState.warnings).toStrictEqual([]);
    expect(globalState.pullRequestsAlreadyNotified).toStrictEqual([]);
  });
});
