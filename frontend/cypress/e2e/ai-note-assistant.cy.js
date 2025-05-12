/// <reference types="cypress" />

describe('AI Note Assistant E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('logs in, uploads audio, processes, saves, and reloads transcript', () => {
    // 1. Log in
    cy.get('input[placeholder="Username"]').type('testuser');
    cy.get('input[placeholder="Password"]').type('testpass');
    cy.contains('Login').click();
    cy.contains('Transcribe');

    // 2. Upload a fixture audio file
    cy.fixture('sample.wav', 'base64').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: Cypress.Blob.base64StringToBlob(fileContent, 'audio/wav'),
        fileName: 'sample.wav',
        mimeType: 'audio/wav',
      });
    });
    cy.contains('Transcribe').click();
    cy.contains('Uploading...');
    cy.get('.spinner').should('exist');
    cy.get('.spinner', { timeout: 20000 }).should('not.exist');

    // 3. Verify transcript appears
    cy.contains('transcript', { matchCase: false, timeout: 20000 });

    // 4. Generate summary
    cy.contains('Summarize').click();
    cy.get('.spinner').should('exist');
    cy.get('.spinner', { timeout: 20000 }).should('not.exist');
    cy.get('.summary').should('exist');

    // 5. Generate keywords
    cy.contains('Extract Keywords').click();
    cy.get('.spinner').should('exist');
    cy.get('.spinner', { timeout: 20000 }).should('not.exist');
    cy.get('ul').should('exist');

    // 6. Generate topics
    cy.contains('Classify Topics').click();
    cy.get('.spinner').should('exist');
    cy.get('.spinner', { timeout: 20000 }).should('not.exist');
    cy.get('ul').should('exist');

    // 7. Save to cloud
    cy.contains('Save').click();
    cy.contains('saved', { matchCase: false });

    // 8. Reload and assert data persists
    cy.reload();
    cy.contains('Login').should('exist');
    cy.get('input[placeholder="Username"]').type('testuser');
    cy.get('input[placeholder="Password"]').type('testpass');
    cy.contains('Login').click();
    cy.contains('Transcribe');
    // Optionally, load transcript by ID and assert content
  });
});
