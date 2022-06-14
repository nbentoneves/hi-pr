import { GLOBAL } from '../../store/constants';
import { mount, StoreSlice } from '../../testing/test-component-mount';
import Preferences from '.';
import {
  interceptGithubOnePullRequest,
  interceptGithubPullRequestNotFound,
} from '../../../cypress/support/utils';

describe('<Preferences>', () => {
  describe('mount component without initial values persisted', () => {
    let initStatus: StoreSlice;

    beforeEach(() => {
      initStatus = {
        name: GLOBAL,
        initialState: {
          pullRequestsAlreadyNotified: [] as string[],
          warnings: [] as string[],
        },
      };
    });

    it('check empty form values', () => {
      mount(<Preferences />, initStatus);

      cy.get('[data-testid=username-input]').should('have.value', '');
      cy.get('[data-testid=teamname-input]').should('have.value', '');
      cy.get('[data-testid=isOrganization-switch]').should('not.be.checked');
      cy.get('[data-testid=token-input]').should('have.value', '');
      cy.get('[data-testid=owner-input]').should('have.value', '');
      // TODO: Find a way to check the select/input field
      // cy.get('[data-testid=repositories-select]').should('have.text', 'hi-pr ');
    });

    it('save a new valid preference not using organization', () => {
      mount(<Preferences />, initStatus);

      interceptGithubOnePullRequest('nbentoneves', 'hi-pr', '1');
      interceptGithubOnePullRequest('nbentoneves', 'other-repo', '2');

      cy.get('[data-testid=username-input]').type('nbentoneves');
      cy.get('[data-testid=repositories-select]').type('hi-pr{enter}');
      cy.get('[data-testid=repositories-select]').type('other-repo{enter}');
      cy.get('[data-testid=on-save-button]').click({ force: true });
      cy.get('.ant-alert').should('not.exist');

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');
      cy.wait('@2-github-one-pull-request-no-requested-reviewers');
    });

    it('save a new valid preference using organization', () => {
      mount(<Preferences />, initStatus);

      interceptGithubOnePullRequest('hi-pr-organization', 'hi-pr', '1');
      interceptGithubOnePullRequest('hi-pr-organization', 'other-repo', '2');

      cy.get('[data-testid=username-input]').type('nbentoneves');
      cy.get('[data-testid=isOrganization-switch]').click();
      cy.get('[data-testid=token-input]').type('github_token');
      cy.get('[data-testid=owner-input]').type('hi-pr-organization');
      cy.get('[data-testid=teamname-input]').type('hi-pr-team');
      cy.get('[data-testid=repositories-select]').type('hi-pr{enter}');
      cy.get('[data-testid=repositories-select]').type('other-repo{enter}');
      cy.get('[data-testid=on-save-button]').click({ force: true });
      cy.get('.ant-alert').should('not.exist');

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');
      cy.wait('@2-github-one-pull-request-no-requested-reviewers');
    });

    it('save a new valid preference and show repository warnings', () => {
      mount(<Preferences />, initStatus);

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

      cy.get('[data-testid=username-input]').type('nbentoneves');
      cy.get('[data-testid=isOrganization-switch]').click();
      cy.get('[data-testid=token-input]').type('github_token');
      cy.get('[data-testid=owner-input]').type('hi-pr-organization');
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
        name: GLOBAL,
        initialState: {
          preferences: {
            username: 'nbentoneves',
            organization: {
              owner: 'hi-pr-organization',
              token: 'github_token',
              teamname: 'hi-pr-team',
            },
            repositories: ['hi-pr'],
          },
          pullRequestsAlreadyNotified: [] as string[],
          warnings: [] as string[],
        },
      };
    });

    it('check prefilled form values', () => {
      interceptGithubOnePullRequest('hi-pr-organization', 'hi-pr');

      mount(<Preferences />, initStatus);

      cy.get('[data-testid=username-input]').should(
        'have.value',
        'nbentoneves',
      );

      cy.get('[data-testid=isOrganization-switch]')
        .invoke('attr', 'value')
        .should('equal', 'true');
      cy.get('[data-testid=token-input]').should('have.value', 'github_token');
      cy.get('[data-testid=owner-input]').should(
        'have.value',
        'hi-pr-organization',
      );
      cy.get('[data-testid=teamname-input]').should('have.value', 'hi-pr-team');
      // TODO: Find a way to check the select/input field
      // cy.get('[data-testid=repositories-select]').should('have.text', 'hi-pr ');

      cy.wait('@github-one-pull-request-no-requested-reviewers');
    });

    it('save a new valid preference, disable organization and clean teamname', () => {
      interceptGithubOnePullRequest('hi-pr-organization', 'hi-pr', '1');
      interceptGithubOnePullRequest('nbentoneves', 'hi-pr', '2');

      mount(<Preferences />, initStatus);

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');

      cy.get('[data-testid=teamname-input]').clear();
      cy.get('[data-testid=isOrganization-switch]').click();
      cy.get('[data-testid=on-save-button]').click({ force: true });

      cy.wait('@2-github-one-pull-request-no-requested-reviewers');
    });

    it('try to save a preference, without one required field', () => {
      interceptGithubOnePullRequest('hi-pr-organization', 'hi-pr', '1');

      mount(<Preferences />, initStatus);

      cy.wait('@1-github-one-pull-request-no-requested-reviewers');

      cy.get('[data-testid=username-input]').clear();
      cy.get('[data-testid=teamname-input]').clear();
      cy.get('[data-testid=isOrganization-switch]').click();
      cy.get('[data-testid=on-save-button]').click({ force: true });

      cy.get('[role=alert]')
        .findByText('Username is required!')
        .should('be.visible');
    });
  });
});
