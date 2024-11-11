# Portfolio Website

Welcome to my portfolio website repository! This project showcases my work, skills, and professional journey in a visually engaging and user-friendly manner. Built with React and TypeScript, featuring GSAP animations, and hosted on GitHub Pages, this site serves as a dynamic and interactive representation of my professional life.

Check out the [Website](https://sm1le21.github.io/).

## Project Overview
The website is designed to provide an overview of my experience, projects, and accomplishments. It features several sections, including About Me, Projects. All displayed information is managed through a central data.json file, making it easy to update and maintain.


### Key Features
- About Me: Detailed information about my education, skills, and interests.
- Projects: A comprehensive list of my projects with descriptions, technologies used, and links to live demos and source code.

### Technologies Used
- Frontend: React, TypeScript, GSAP for animations, CSS for styling
- Backend: For now the data is managed entirely through data.json for dynamic content updates
- Deployment: GitHub Pages

### Design and Data Management
The entire website's content is driven by a single data.json file. This design choice allows for easy modifications and the potential for the website to be reused by others with minimal changes. Here is an excerpt of the data.json file structure:

```json
{
    "name": "Tun Keltesch",
    "title": "Junior Project Engineer | Software Engineer",
    "description": "I build robust, user-friendly, and visually appealing web solutions, with a passion for continuous technical innovation.",
    "about": [
       ...
    ],
    ...
}
```

## TK CHAT implementation

I have successfully implemented **TK CHAT**, my AI-powered chatbot that assists with navigation and provides information about various sections of the portfolio website. You can check out the project on [GitHub](https://github.com/SM1LE21/TK_CHAT).

### Features of TK CHAT

- The chatbot utilizes OpenAI's function-calling capabilities to interpret user requests and navigate to relevant sections of the website.
- It has access to all existing sections, allowing it to direct users to them. For instance, if you ask about "Tun's education," the chatbot will navigate you to the Education section and provide a brief summary of the content.
- Currently, the chatbot can only navigate to general sections like "Projects", "Education", "About", etc. It is not able yet to navigate to individual project pages.

### Limitations and Ongoing Improvements

- The chat experience on mobile devices is not ideal yet. Mobile users are presented with a full-screen chat interface, making it difficult to notice when the website navigates in the background.
- The navigation feature needs further refinement for a better user experience on mobile devices.
- I am iterating on the navigation functionality while experimenting with additional use cases where the AI can autonomously make decisions and call other frontend functions.


## Current Status and Future Plans

The project is still in development. Some features, such as mobile navigation, are not perfect yet, and not all of my projects are displayed. I have chosen not to include projects done for clients or employers to avoid detailing work that is not my intellectual property.

Future updates will include:

- [ ] A detailed description of the website's development process
- [x] An AI chatbot to assist with navigation and answering questions about me
- [ ] New TK CHAT features and use cases.

## Contact
For any feedback, ideas, questions, or inquiries, feel free to reach out to me via Email or connect with me on LinkedIn.

Thank you for visiting my portfolio website repository! Your feedback and support are greatly appreciated.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).