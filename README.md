# Flight Risk Assesment Form

The Flight Risk Assessment Form is an interactive web application where UNO Aviation students would go to fill out a form prior to taking a flight. The web site is adaptable so it can be filled out on all different types of devices including smart phones and iPads. The form includes basic questions about the student pilot as well as information about the intended flight. As the student fills out the interactive form, more questions appear based on previous options that the student has selected. Once the first page is filled out, the student will be taken to a new page that will display the METAR data for the departure, arrival, and alternate airport that they had previously put into the form. Along with the METARs, Airmets and Sigmets will also be displayed to the user. All of this information is color coded to make it easier for students to read and understand. Finally, after a few more questions, the risk factors of the flight are displayed to the student. 

Not only does the web application have the risk assessment form but it also includes an administrative side. This can be reached from a link on the form. Once clicked, the professor will have to login in which will then bring them to the Admin Panel. Here, the instructor can see the current risk limits and also change these limits.  

This application is stored in two GitHub repositories. The first repository is for the frontend. The frontend was coded in React, along with HTML and CSS for formatting. The second repository stores the backend. The backend was coded in Bootstrap along with cucumber for the testing.

## How To Run The Application

The front end of the UNO Flight Risk Assessment form is currently being hosted at https://master.d2yptjh43tx2yz.amplifyapp.com/-. 

With that being said, should someone want to download the code and run it from the GitHub repository follow the following steps.

1) Go to https://github.com/zhartzog/capstone-flight-risk-assesment to download the back end of the project
2) Go to https://github.com/martin-simonini/Flight-Risk-Assessment-Frontend to download the front end of the project
3) After the downloads are complete, navigate to the src directory of the back end and open a command prompt. From here, use the command mvn clean install. This will validate the dependencies used by the back end of the project
4) To run the back end, execute the command mvn spring-boot:run
5) Once the back end has initialized and started correctly, navigate to the src directory of the front end and execute a clean install again (npm clean install)
6) After this is complete, execute npm start. The front end should be running on port 3030 of the local host. The end points from the repository are set up to run from the localhost.
