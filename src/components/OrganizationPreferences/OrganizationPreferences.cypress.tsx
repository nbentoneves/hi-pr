import { State } from 'src/store/feature/organizationPreferencesSlice';
import { StoreSlice } from '../../testing/test-utils';
import { ORGANIZATION_PREFERENCES } from '../../store/constants';
import { mount } from '../../testing/test-component-mount';
import {
  interceptGithubOnePullRequest,
  interceptGithubPullRequestNotFound,
} from '../../../cypress/support/utils';
import OrganizationPreferences from '.';

describe('<OrganizationPreferences>', () => {
  describe('mount component without initial values persisted', () => {
    let initStatus: StoreSlice;

    beforeEach(() => {
      initStatus = {
        name: ORGANIZATION_PREFERENCES,
        initialState: {
          pullRequestsAlreadyNotified: [] as string[],
          warnings: [] as string[],
        },
      };
    });

    it('check empty form values', () => {
      mount(<OrganizationPreferences />, initStatus);

      cy.get('[data-testid=isEnable-switch]').should('not.be.checked');
      cy.get('[data-testid=username-input]').should('have.value', '');
      cy.get('[data-testid=teamname-input]').should('have.value', '');
      cy.get('[data-testid=token-input]').should('have.value', '');
      cy.get('[data-testid=organization-input]').should('have.value', '');
      // TODO: Find a way to check the select/input field
      // cy.get('[data-testid=repositories-select]').should('have.text', 'hi-pr ');
    });

    it('save a new valid preference', () => {
      mount(<OrganizationPreferences />, initStatus);

      interceptGithubOnePullRequest('hi-pr-organization', 'hi-pr', '1');
      interceptGithubOnePullRequest('hi-pr-organization', 'other-repo', '2');

      cy.get('[data-testid=isEnable-switch]').click();
      cy.get('[data-testid=username-input]').type('nbentoneves');
      cy.get('[data-testid=token-input]').type('github_token');
      cy.get('[data-testid=organization-input]').type('hi-pr-organization');
      cy.get('[data-testid=teamname-input]').type('hi-pr-team');
      cy.get('[data-testid=repositories-select]').type('hi-pr{enter}');
      cy.get('[data-testid=repositories-select]').type('other-repo{enter}');
      cy.get('[data-testid=on-save-button]').click({ force: true });
      cy.get('.ant-alert').should('not.exist');

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');
      cy.wait('@2-github-one-pull-request-no-requested-reviewers');
    });

    it('save a new valid preference and show repository warnings', () => {
      mount(<OrganizationPreferences />, initStatus);

      interceptGithubPullRequestNotFound(
        'hi-pr-organization',
        'other-repo1',
        '1',
      );
      interceptGithubPullRequestNotFound(
        'hi-pr-organization',
        'other-repo2',
        '2',
      );

      cy.get('[data-testid=isEnable-switch]').click();
      cy.get('[data-testid=username-input]').type('nbentoneves');
      cy.get('[data-testid=token-input]').type('github_token');
      cy.get('[data-testid=organization-input]').type('hi-pr-organization');
      cy.get('[data-testid=teamname-input]').type('hi-pr-team');
      cy.get('[data-testid=repositories-select]').type('other-repo1{enter}');
      cy.get('[data-testid=repositories-select]').type('other-repo2{enter}');
      cy.get('[data-testid=on-save-button]').click({ force: true });
      cy.findByTestId('alert-other-repo1').should(
        'contain.text',
        'Did you type the other-repo1 repository name right?',
      );
      cy.findByTestId('alert-other-repo2').should(
        'contain.text',
        'Did you type the other-repo2 repository name right?',
      );

      cy.wait('@1-github-pull-request-not-found');
      cy.wait('@2-github-pull-request-not-found');
    });
  });

  describe('mount component with initial values persisted', () => {
    let initStatus: StoreSlice;

    beforeEach(() => {
      initStatus = {
        name: ORGANIZATION_PREFERENCES,
        initialState: {
          preferences: {
            username: 'nbentoneves',
            teamname: 'hi-pr-team',
            organization: {
              name: 'hi-pr-organization',
              token: 'github_token',
            },
            repositories: ['hi-pr'],
          },
          enabled: true,
          pullRequestsAlreadyNotified: [] as string[],
          warnings: [] as string[],
        } as State,
      };
    });

    it('check pre filled form values', () => {
      interceptGithubOnePullRequest('hi-pr-organization', 'hi-pr');

      mount(<OrganizationPreferences />, initStatus);

      cy.get('[data-testid=username-input]').should(
        'have.value',
        'nbentoneves',
      );

      cy.get('[data-testid=isEnable-switch]')
        .invoke('attr', 'value')
        .should('equal', 'true');
      cy.get('[data-testid=token-input]').should('have.value', 'github_token');
      cy.get('[data-testid=organization-input]').should(
        'have.value',
        'hi-pr-organization',
      );
      cy.get('[data-testid=teamname-input]').should('have.value', 'hi-pr-team');
      // TODO: Find a way to check the select/input field
      // cy.get('[data-testid=repositories-select]').should('have.text', 'hi-pr ');

      cy.wait('@github-one-pull-request-no-requested-reviewers');
    });

    it('save a preference without one required field', () => {
      interceptGithubOnePullRequest('hi-pr-organization', 'hi-pr', '1');

      mount(<OrganizationPreferences />, initStatus);

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');

      cy.get('[data-testid=organization-input]').clear();
      cy.get('[data-testid=on-save-button]').click({ force: true });

      cy.get('[role=alert]')
        .findByText('Organization is required!')
        .should('be.visible');
    });
  });
});
