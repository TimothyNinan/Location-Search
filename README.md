# Location Search

## Summary
The Location Search project aims to create a web application that allows the user to search for various types of locations in close vicinity to the user. Users will interact with this web application through a signup/login process found on our landing page. After logging into the website, the user will be introduced to the main search interface which contains an interactive map. 
Included in the user interface is a way to filter for a specific type of location and give either exact coordinates of the user’s location or pinning a location on the map. The two types of filters users can use will be searching for locations based on their ratings and type of location. It is relevant to mention that the results are displayed as pins in the map and, thanks to a sidebar, users can see the details of each location that may interest them such as distance, user ratings, and price level. Moreover, the user will be able to sort the results by price, rating, and distance, and select the number of locations displayed. 
Finally, the map is supposed to be responsive and interactive, showing a mini-popup with main details when hovering over a location pin and listing more detailed information like the website of the location when clicking on the location pin.


## Release Notes
v. 1.0.0

### New Software Features
- SearchAPI integration
- Sorting and filtering by rating, price, and distance
- Login/Signup system using Google OAuth
- Location input with pin-drop
- Map integrartion with pins, hover panes, and detailed modals

### Resolved Bugs
- Fixed the hover panes leaving a white background on the map
- Fixed API results not being displayed
- Fixed page overflow issues

### Known Bugs
- When a detailed pane is open, other pins can still be selected

## Install Guide

### Pre-requisites
- Node.js
- npm
- Java
- Maven
- VSCode (or any IDE that supports Java and Spring Boot)

### Dependent Libraries
The following libraries are required to run the project.
They all are either included in the project or can be installed using `npm install`.
- React
- Spring Boot Web
- Google App Engine
- Google OAuth

### Download Instructions
To download the project, clone the repository and navigate to the front-end and back-end directories.

```
git clone https://github.com/jjones634/cs3300group11.git
```

### Installation of Actual Application

#### Front-End
Navigate to the front-end directory.
```
cd front-end
```

In the front-end directory, run the following to install dependencies:
```
npm install
```

#### Back-End
Running the back-end will automatically build the project.
To manually build the project, navigate to the back-end directory and run the following:
```
./mvnw clean install
```

### Run Instructions

#### Front-End
In the front-end directory, run the following to start the development server:
```
npm run dev
```

Navigate to [http://localhost:5173/](http://localhost:5173/) to view the website.

#### Back-End

##### Simple Run
If you are using VSCode, install the Spring Boot Extension.
In the `back-end/src/main/java/com/location/search` directory, open the `SearchApplication.java` file.
In the top right corner, click the "Run" button.

##### Manual Run

In the same directory, run the following to start the development server:
```
./mvnw spring-boot:run
```

### Troubleshooting
If you have build errors, try cleaning the project and reloading.

In VSCode, cmd + shift + p, type and select Java: Clean Java Language Server Workspace.
You should be given a prompt to reload the workspace. Click reload.

## GCP Deployment 
https://frontend-service-dot-cs3300-location-project.ue.r.appspot.com/ 