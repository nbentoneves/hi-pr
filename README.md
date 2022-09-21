[![Build](https://github.com/nbentoneves/hi-pr/actions/workflows/build.yml/badge.svg)](https://github.com/nbentoneves/hi-pr/actions/workflows/build.yml)

<img src="./logo.png?raw=true" />

Notification Widget to notify you about new PRs 🚀

## Description & Motivation

Widget which allow you to receive notification when you have new pull requests to review.

<!-- TODO: Write about the motivation -->

## Support

This is a quite new project and currently it's only support the following providers:

- Github ✅
- Bitbucket ❌
- Gitlab ❌

## Compile & Technology 🏗️

These are the principal frameworks/tools used in this project:

- Application: `reactjs` and `electronjs`
- State managing: `redux-toolkit` and `redux-persist`
- Testing: `jest`, `cypress`, `selenium` and `mock-server`
- Building: `electron-builder`

It's easy to compile the project. Is using npm to manage dependencies,
this way, you only need to run the following command to install all the necessary dependencies:

```
e.g: ./yarn run install && yarn run electron:postinstall
```

> You can use the `mock-server` to help when you are developing, you only need to set the env property `REACT_APP_MOCK_SERVER_ENABLED=true`

## Run ▶️

To run the application, locally, you will need to run the following command:

```
yarn run electron:dev
```

> This command will run concurrently the necessary commands to run `reactjs` and `electronjs`.

## Testing suites 🧪

### Unit tests

Testing small parts of the code is important for a good quality in the project. You can/should create unit tests for utilities methods, small pieces or simple part of the code.
You have available `jest` with `react-testing-library` to help you. Please use the `src/testing/test-util.tsx` file to `render` a component, if you want to test it using unit tests.

> Using: jest, react-testing-library

> Out of scope:
>
> - State managing: You cannot manipulate the state;
> - Styling: not available using unit tests;
> - Electronjs: funcionalities from electronjs they are not available.

#### Runing

```
yarn run test:unit
```

### Component tests

Do you need to test a complex part of your code? Component tests with `cypress` allows you to `mount` the component you need to test with the capability to manipulate the internal state. Using this will help you to test the component isolated from the entire application logic.
Unfortunately `cypress` is not support funcionalities from the `electronjs`, e.g: notifications, that way you cannot test specific behaviour for each operating system.

> Using: jest, react-testing-library, cypress

> Out of scope:
>
> - Electronjs: funcionalities from electronjs they are not available.

#### Runing

```
yarn run cypress:component-test
```

### E2E tests

Unfortunately currently we don't have a way to run the `e2e` tests automatically. This is a mix between automation and manually validation. Also it's using `mock-server` to mock the provider API, because, is impossible to have real scenarios configured from the external providers.
We hope 🤞 in the future improve this and using this as part of our CI/CD pipeline.

> Using: jest, selenium, mock-server

> Out of scope:
>
> - Electronjs: funcionalities from electronjs they are available but we need to check them manually.

#### Runing

```
#Build the application inside of dist-e2e and using mock-server as a provider
yarn run electron:build-e2e

#Run mock-server and selenium webdriver
yarn run test:pre-e2e

yarn run test:e2e
```

## Release & Deploy 🚀

1. Run locally the e2e/manually validation. [How to run e2e](###-e2e-tests)

   1. yarn run electron:build-e2e
   2. yarn run test:pre-e2e
   3. yarn run test:e2e

2. Update the application version. Using one of the following commands:

   1. yarn run release-major
   2. yarn run release-minor
   3. yarn run release-patch

3. Commit and push the version upgrade using release git-cz type

4. Open a PR from `master` to `release`. Ask for someone admin to accept the PR.

5. Go to github release page and click at `Draft a new release`

   1. Choose a tag - create a new version tag following this pattern: `v.{major_release}.{minor_release}.{patch_release}`
   2. Target: set the target to `release` branch
   3. Click at Generate release notes, make the necessary ajustements
   4. Click at `Save draft`

6. Check the github action `Release` and wait to have the assets available

## Contributing 🙌

Pull requests are welcome. Please check the [CONTRIBUTING.md] to find the best way to contribute.

## License

This opensource project is under the following license: [MIT]

[contributing.md]: https://github.com/nbentoneves/hi-pr/blob/main/CONTRIBUTING.md
[mit]: https://github.com/nbentoneves/hi-pr/blob/main/LICENSE.txt
