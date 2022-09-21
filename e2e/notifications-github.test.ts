import path from 'path';
import webdriver, { Key } from 'selenium-webdriver';
import inquirer from 'inquirer';
import {
  resetMockCustomRoutesVariants,
  setMockCustomRoutesVariants,
} from './mocks/http-client';

describe('Hi-PR! - Notification Github Test', () => {
  const capabilities = {
    'goog:chromeOptions': {
      binary: path.resolve(
        './dist-e2e/mac-arm64/Hi-PR!.app/Contents/MacOS/Hi-PR!',
      ),
      prefs: {
        profile: {
          content_settings: {
            exceptions: {
              // TODO: This is not working, please check the notification manually
              notifications: {
                '*': {
                  expiration: '0',
                  last_modified: '13298561570061718',
                  model: 0,
                  setting: 1,
                },
              },
            },
          },
        },
      },
    },
  };

  describe('E2E Testing - Hi-PR!', () => {
    const btnNewConfiguration = webdriver.By.xpath(
      '//button[@data-testid="on-new-configuration"]',
    );
    const btnSave = webdriver.By.xpath(
      '//button[@data-testid="on-save-button"]',
    );

    const inputName = webdriver.By.id('configuraton_name');
    const inputOwner = webdriver.By.id('configuraton_owner');
    const inputUsername = webdriver.By.id('configuraton_username');
    const inputTeam = webdriver.By.id('configuraton_teamname');
    const inputToken = webdriver.By.id('configuraton_token');
    const inputRepositories = webdriver.By.id('configuraton_repositories');

    afterEach(() => {
      resetMockCustomRoutesVariants();
    });

    it('get a notification for an user to review a pull request', async () => {
      const driver = await new webdriver.Builder()
        .usingServer('http://localhost:9515')
        .withCapabilities(capabilities)
        .forBrowser('chrome')
        .build();

      try {
        setMockCustomRoutesVariants(
          'github-pull-requests:success-with-pull-requests-to-user-review',
        );

        await driver.findElement(btnNewConfiguration).click();

        await driver.findElement(inputName).sendKeys('Hi-PR Configuration');
        await driver.findElement(inputUsername).sendKeys('nbentoneves');
        await driver.findElement(inputOwner).sendKeys('hi-pr-org');
        await driver.findElement(inputRepositories).sendKeys('hi-pr');

        // TODO: Check why .sendKeys('hi-pr', Key.ENTER, Key.ESCAPE) is not working
        await driver.findElement(inputRepositories).sendKeys(Key.ENTER);

        await driver.findElement(btnSave).click();

        await inquirer
          .prompt({
            type: 'confirm',
            message:
              'Are you seeing one notification with the following message: "You have an user pull request to review: <url>"?',
            name: 'result',
          })
          .then((answers) => {
            if (!answers.result) {
              throw new Error(
                'Expected an user notification with the following message: "You have an user pull request to review: <url>"!',
              );
            }
          });
      } finally {
        driver.quit();
      }
    });

    it('get a notification for a team to review a pull request', async () => {
      const driver = await new webdriver.Builder()
        .usingServer('http://localhost:9515')
        .withCapabilities(capabilities)
        .forBrowser('chrome')
        .build();

      try {
        setMockCustomRoutesVariants(
          'github-pull-requests:success-with-pull-requests-to-team-review',
        );

        await driver.findElement(btnNewConfiguration).click();

        await driver.findElement(inputName).sendKeys('Hi-PR Configuration');
        await driver.findElement(inputUsername).sendKeys('nbentoneves');
        await driver.findElement(inputOwner).sendKeys('hi-pr-org');
        await driver.findElement(inputTeam).sendKeys('Justice League');
        await driver.findElement(inputToken).sendKeys('gh_token');
        await driver.findElement(inputRepositories).sendKeys('hi-pr');

        // TODO: Check why .sendKeys('hi-pr', Key.ENTER, Key.ESCAPE) is not working
        await driver.findElement(inputRepositories).sendKeys(Key.ENTER);

        await driver.findElement(btnSave).click();

        await inquirer
          .prompt({
            type: 'confirm',
            message:
              'Are you seeing one notification with the following message: \n"You have a team pull request to review: <url>"?',
            name: 'result',
          })
          .then((answers) => {
            if (!answers.result) {
              throw new Error(
                'Expected a team notification with the following message: \n"You have a team pull request to review: <url>"!',
              );
            }
          });
      } finally {
        driver.quit();
      }
    });
  });
});
