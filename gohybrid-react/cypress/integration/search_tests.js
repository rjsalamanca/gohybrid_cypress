const currentYear = new Date().getFullYear()

context('Main Search Tests', () => {
   beforeEach(() => {
      cy.visit('http://localhost:3001');
   })

   it('Selecting Year Alone', () => {
      // Clicks on the current year.
      cy.get('#selectYear')
         .select(`${currentYear}`).invoke('val');

      cy.get('#selectedYear')
         .contains(`${currentYear}`);
   })

   it('Selecting Make Alone', () => {
      // By default has a length of 2.
      cy.get('#selectMake')
         .children()
         .should('have.length', 2);
   })

   describe('Selecing Different Year and Make', () => {
      // Testing with known models
      it('Selecting with Known Hybrids', () => {
         cy.get('#selectYear')
            .select(`${currentYear}`).invoke('val');

         cy.get('#selectMake')
            .select('Acura').invoke('val');

         cy.get('.carModels')
            .should('be.visible')
            .children((child) => {
               //should have children!
               expect(child).to.be.greaterThan(0);
            });
      });

      it('Selecting with No Hybrids', () => {
         cy.get('#selectYear')
            .select(`${currentYear}`).invoke('val');

         cy.get('#selectMake')
            .select('Alfa Romeo').invoke('val');

         cy.get('.carModels')
            .should('not.be.visible');

         cy.contains('No Hybrids Found');
      })
   })
});