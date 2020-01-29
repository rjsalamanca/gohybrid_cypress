// const goHybridAPI = 'http://localhost:3000/users/login';

// This part of the code is a part of 'Testing Downed Server'
// Cypress.on('fail', (error, runnable) => {
//   let test = error.stack.toString();
//   console.log('this a test:',test.replace(/\s/g,''))
//   console.log(test.replace(/\s/g,'').includes(`CypressError:cy.request()failedtryingtoload:${goHybridAPI}`))
//   throw error // throw error to have test still fail
// })

describe('Login Page Tests', () => {
   it('Redirects to the login page', () => {
      cy.visit('http://localhost:3001/');
      cy.contains('Login')
         .click();
   });

   it('Testing Downed Server', function () {
      cy.server();

      // Issues:
      // Testing if we don't get a response from our API.
      // Have to find a way to expect the response status of 404 or 
      // intercept failed trying to load. This test will fail for the time being.
      //
      // To replicate what I wanted to test by the request failing, stop running gohybrid-express 
      // and reload the react application.

      cy.contains('Sign In')
         .click()
         .request(
            'POST',
            'http://localhost:3010/users/login',
            { email: 'test1@email.com', password: '1' },
            'failOnStatusCode: false'
         ).then(response => {
            expect(response.status).to.eq(200);
         });
   })

   it('Using different login credentials', function () {
      const users = [
         { email: 'test1@email.com', password: '2' }, // correct Username wrong password
         { email: 'test2@email.com', password: '2' }, // correct Username wrong password
         { email: 'test1@email.com', password: '1' } // correct Username and Password
      ];

      cy.server();

      cy.url()
         .should('include', '/users/login');

      // Loop through users array and test all email and passwords sent
      cy.wrap(users)
         .each((login, index) => {
            if (index !== 0) {
               cy.visit('http://localhost:3001/users/login');
            }
            cy.get('#emailAddress')
               .type(login.email)
               .should('have.value', login.email);

            cy.get('#emailAddressPassword')
               .type(login.password)
               .should('have.value', login.password);


            cy.contains('Sign In')
               .click()
               .request('POST', 'http://localhost:3000/users/login', login)
               .then((response) => {
                  // If our response is an object with more than 2 keys, we test for true login values.
                  if (Object.keys(response.body).length > 2) {
                     expect(response.body).to.have.property('id');
                     expect(response.body).to.have.property('first_name');
                     expect(response.body).to.have.property('last_name');
                     expect(response.body).to.have.property('email', login.email);
                     expect(response.body).to.have.property('login', true);
                  } else {
                     // Testing for alerts and proper error codes.
                     const testAlerts = cy.get('.alert').should('be.visible');
                     const { errorCode } = response.body;

                     expect(response.body).to.have.property('errorCode');
                     expect(response.body).to.have.property('login', false);

                     if (errorCode == 1) {
                        testAlerts.contains(`Sorry, we couldn't find you.`);
                     } else if (errorCode === 2) {
                        testAlerts.contains(`You've entered in the wrong password`);
                     }
                  }
               });
         });

      // After redirection, url should be http://localhost:3001/users
      cy.url().should('eq', 'http://localhost:3001/users');
   });
});