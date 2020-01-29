# GoHybrid With Cypress Testing

GoHybrid is indended for car consumers looking to purchase hybrid vehicles and comparing hybrid models to their gas counter parts. Using an external Government run vehicle API, this application gets details about various cars. Using that information, GoHybrid calculates how much money you would save by purchasing the hybrid model versus the gas model. If you have multiple cars you like, you can log in and save comparisons!

This application is created with a ***PERN*** stack. (postgreSQL, Express, React, and Node).

---

## **Run Instructions**

1. Download or Fork repository
1. In your terminal, open 2 tabs
1. In your **FIRST** tab navigate to the gohybrid directory
   1. Change directory into the 'gohybrid-express' directory and run 'npm install'
   1. After installation of node modules are complete go into postgreSQL and create a database for gohybrid, then you can exit.
   1. Navigate to gohybrid-express/models/conn.js
   1. Edit the conn.js files with your host, database, and user
   1. Go back to the terminal and enter the command 'npm run dev'. Our backend should be up and running.
1. In your **SECOND** tab navigate to the gohybrid directory
   1. Change directory into the 'gohybrid-react' directory and run 'npm install'
   1. Run the command 'npm start'. In the prompt, type 'Y'. Our frontend end should be up and running! You can stop here if you're not testing

## **Cypress Testing Instructions**

1. Follow all the steps above.
1. Open another tab in your terminal.
1. In your tab navigate to the gohybrid directory
1. Change directory into the 'gohybrid-react' directory
1. Run the command 'npm run cypress'
