import path from 'path';
import webdriver, { Key } from 'selenium-webdriver';
import inquirer from 'inquirer';
import {
  resetMockCustomRoutesVariants,
  setMockCustomRoutesVariants,
} from './mocks/http-client';

describe('Hi-PR! - Notification test', () => {
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

  describe('using organization tab', () => {
    afterEach(() => {
      resetMockCustomRoutesVariants();
    });

    it('get a notification for an username review a pull request', async () => {
      const driver = await new webdriver.Builder()
        .usingServer('http://localhost:9515')
        .withCapabilities(capabilities)
        .forBrowser('chrome')
        .build();

      try {
        setMockCustomRoutesVariants(
          'github-pull-requests:success-with-pull-requests-to-user-review',
        );

        await driver.findElement(webdriver.By.id('rc-tabs-0-tab-2')).click();

        await driver
          .findElement(webdriver.By.id('preferences_isEnabled'))
          .click();

        await driver
          .findElement(webdriver.By.id('preferences_username'))
          .sendKeys('nbentoneves');

        await driver
          .findElement(webdriver.By.id('preferences_token'))
          .sendKeys('gh_token');

        await driver
          .findElement(webdriver.By.id('preferences_organization'))
          .sendKeys('hi-pr-org');

        // TODO: Check why .sendKeys('hi-pr', Key.ENTER, Key.ESCAPE) is not working
        await driver
          .findElement(webdriver.By.id('preferences_repositories'))
          .sendKeys('hi-pr');

        await driver
          .findElement(webdriver.By.id('preferences_repositories'))
          .sendKeys(Key.ENTER);

        await driver
          .findElement(webdriver.By.id('preferences_repositories'))
          .sendKeys(Key.ESCAPE);

        await driver
          .findElement(
            webdriver.By.xpath('//button[@data-testid="on-save-button"]'),
          )
          .click();

        await inquirer
          .prompt({
            type: 'confirm',
            message:
              'Did you see one notification with the following message: "You have an user pull request to review: <url>"?',
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

    it('get a notification for a team review a pull request', async () => {
      const driver = await new webdriver.Builder()
        .usingServer('http://localhost:9515')
        .withCapabilities(capabilities)
        .forBrowser('chrome')
        .build();

      try {
        setMockCustomRoutesVariants(
          'github-pull-requests:success-with-pull-requests-to-team-review',
        );

        await driver.findElement(webdriver.By.id('rc-tabs-0-tab-2')).click();

        await driver
          .findElement(webdriver.By.id('preferences_isEnabled'))
          .click();

        await driver
          .findElement(webdriver.By.id('preferences_username'))
          .sendKeys('nbentoneves');

        await driver
          .findElement(webdriver.By.id('preferences_token'))
          .sendKeys('gh_token');

        await driver
          .findElement(webdriver.By.id('preferences_teamname'))
          .sendKeys('Justice League');

        await driver
          .findElement(webdriver.By.id('preferences_organization'))
          .sendKeys('hi-pr-org');

        // TODO: Check why .sendKeys('hi-pr', Key.ENTER, Key.ESCAPE) is not working
        await driver
          .findElement(webdriver.By.id('preferences_repositories'))
          .sendKeys('hi-pr');

        await driver
          .findElement(webdriver.By.id('preferences_repositories'))
          .sendKeys(Key.ENTER);

        await driver
          .findElement(webdriver.By.id('preferences_repositories'))
          .sendKeys(Key.ESCAPE);

        await driver
          .findElement(
            webdriver.By.xpath('//button[@data-testid="on-save-button"]'),
          )
          .click();

        await inquirer
          .prompt({
            type: 'confirm',
            message:
              'Did you see one notification with the following message: \n"You have a team pull request to review: <url>"?',
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
