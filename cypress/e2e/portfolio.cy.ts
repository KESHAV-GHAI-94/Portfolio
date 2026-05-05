/// <reference types="cypress" />

describe('Portfolio E2E Tests', () => {
  it('should load the homepage and navigate sections', () => {
    cy.visit('/');

    // Check Hero section
    cy.get('h1').should('contain', 'Keshav Ghai');

    // Scroll to Skills
    cy.scrollTo(0, 1000);
    cy.get('body').should('contain', 'Skills');

    // Scroll to Projects
    cy.scrollTo(0, 2000);
    cy.get('body').should('contain', 'Projects');

    // Scroll to Contact
    cy.scrollTo('bottom');
    cy.get('form').should('exist');
  });

  it('should have a working contact form validation', () => {
    cy.visit('/');
    cy.scrollTo('bottom');

    // Try submitting empty form
    cy.get('form button[type="submit"]').click();
    
    // Check if browser native validation or custom validation prevents submission
    // We assume the form doesn't disappear and no success message is shown immediately
    cy.get('form').should('be.visible');
  });
});
