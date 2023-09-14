/* eslint-disable testing-library/await-async-query */
import update from 'immutability-helper';
import { interceptGithubOnePullRequest } from '../../cypress/support/utils';
import App from '../App';
import { GITHUB_CONFIGURATIONS } from '../store/constants';
import {
  Configuration,
  State as GithubState,
} from '../store/feature/githubSlice';
import { mount } from '../testing/test-component-mount';
import { buildStoreWithPersist, StoreSlice } from '../testing/test-utils';

describe('<App>', () => {
  describe('Github provider', () => {
    let initStatus: StoreSlice;

    beforeEach(() => {
      cy.clearLocalStorage();

      initStatus = {
        name: GITHUB_CONFIGURATIONS,
        initialState: {
          type: 'GITHUB',
          pullRequestsAlreadyNotified: [],
          warnings: [],
          configurations: [],
        } as GithubState,
      };
    });

    describe('retry configuration', () => {
      it('disable configuration for an existing configuration', () => {
        const localInitStatus = update(initStatus, {
          initialState: {
            configurations: {
              $push: [
                {
                  identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
                  name: 'My personal Github',
                  enabled: true,
                  username: 'hi-pr-username',
                  owner: 'nbentoneves',
                  repository: 'hi-pr',
                } as Configuration,
              ],
            },
          },
        });

        cy.clock();

        interceptGithubOnePullRequest('nbentoneves', 'hi-pr', '1');

        mount(<App />, buildStoreWithPersist(localInitStatus));

        cy.get('.ant-table-row > :nth-child(1)').within(($firstRow) => {
          cy.wrap($firstRow)
            .get('button')
            .then(($button) => {
              cy.wrap($button).should('have.attr', 'aria-checked', 'true');
              cy.wrap($button).click();
              cy.wrap($button).should('have.attr', 'aria-checked', 'false');
            });
        });
      });

      it('retry request after 10 secunds', () => {
        const localInitStatus = update(initStatus, {
          initialState: {
            configurations: {
              $push: [
                {
                  identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
                  name: 'My personal Github',
                  enabled: true,
                  username: 'hi-pr-username',
                  owner: 'nbentoneves',
                  repository: 'hi-pr',
                } as Configuration,
              ],
            },
          },
        });

        cy.clock();

        interceptGithubOnePullRequest('nbentoneves', 'hi-pr', '1');

        mount(<App />, buildStoreWithPersist(localInitStatus));

        cy.tick(11 * 1000);
        cy.wait('@1-github-one-pull-request-no-requested-reviewers');
      });
    });

    it('add a new configuration without organization', () => {
      mount(<App />);

      interceptGithubOnePullRequest('nbentoneves', 'hi-pr', '1');

      cy.get('[data-testid="on-new-configuration"]').click();
      cy.get('[data-testid="name-input"]').type('My personal Github');
      cy.get('[data-testid="username-input"]').type('hi-pr-username');
      cy.get('[data-testid="owner-input"]').type('nbentoneves');
      cy.get('[data-testid="repository-input"]').type('hi-pr');
      cy.get('.ant-layout-content').click();

      cy.get('[data-testid=on-save-button]').click();

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');

      cy.findByText('My personal Github');

      cy.get('.ant-table-row > :nth-child(1)').within(($firstRow) => {
        cy.wrap($firstRow)
          .get('button')
          .should('have.attr', 'aria-checked', 'true');
      });
    });

    it('add a new configuration with one repository', () => {
      mount(<App />);

      interceptGithubOnePullRequest('nbentoneves', 'hi-pr', '1');

      cy.get('[data-testid="on-new-configuration"]').click();
      cy.get('[data-testid="name-input"]').type('My personal Github');
      cy.get('[data-testid="username-input"]').type('hi-pr-username');
      cy.get('[data-testid="token-input"]').type('github-token');
      cy.get('[data-testid="owner-input"]').type('nbentoneves');
      cy.get('[data-testid="repository-input"]').type('hi-pr');
      cy.get('.ant-layout-content').click();

      cy.get('[data-testid=on-save-button]').click();

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');

      cy.findByText('My personal Github');

      cy.get('.ant-table-row > :nth-child(1)').within(($firstRow) => {
        cy.wrap($firstRow)
          .get('button')
          .should('have.attr', 'aria-checked', 'true');
      });
    });

    it('update a configuration with valid inputs', () => {
      const localInitStatus = update(initStatus, {
        initialState: {
          configurations: {
            $push: [
              {
                identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
                name: 'My personal Github',
                enabled: true,
                username: 'hi-pr-username',
                owner: 'nbentoneves',
                repository: 'hi-pr',
              } as Configuration,
            ],
          },
        },
      });

      interceptGithubOnePullRequest('nbentoneves', 'hi-pr', '1');
      interceptGithubOnePullRequest('nbentoneves-new-owner', 'hi-pr', '2');

      mount(<App />, buildStoreWithPersist(localInitStatus));

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');

      cy.get('.ant-table-row > :nth-child(3)').within(($firstRow) => {
        cy.wrap($firstRow)
          .get(
            '[data-testid="update-config-b205e4ba-1d8e-4e25-89ad-00dbc35959f7"]',
          )
          .click();
      });

      cy.get('[data-testid="name-input"]').should(
        'have.value',
        'My personal Github',
      );
      cy.get('[data-testid="owner-input"]').should('have.value', 'nbentoneves');

      cy.get('[data-testid="name-input"]')
        .clear()
        .type('My personal Github - Updated');

      cy.get('[data-testid="owner-input"]')
        .clear()
        .type('nbentoneves-new-owner');

      cy.get('[data-testid=on-save-button]').click();

      cy.findByText('My personal Github - Updated');

      cy.wait('@2-github-one-pull-request-no-requested-reviewers');
    });

    it.skip('delete a configuration', () => {
      const localInitStatus = update(initStatus, {
        initialState: {
          configurations: {
            $push: [
              {
                identifier: 'b205e4ba-1d8e-4e25-89ad-00dbc35959f7',
                name: 'My personal Github',
                enabled: true,
                username: 'hi-pr-username',
                owner: 'nbentoneves',
                repository: 'hi-pr',
              } as Configuration,
            ],
          },
        },
      });

      interceptGithubOnePullRequest('nbentoneves', 'hi-pr', '1');

      mount(<App />, buildStoreWithPersist(localInitStatus));

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');

      cy.get('.ant-table-row > :nth-child(3)').within(($firstRow) => {
        cy.wrap($firstRow)
          .get(
            '[data-testid="delete-config-b205e4ba-1d8e-4e25-89ad-00dbc35959f7"]',
          )
          .click();
      });

      cy.findAllByText('My personal Github').should('not.exist');
    });
  });
});
