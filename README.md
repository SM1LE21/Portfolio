# Portfolio Website

Welcome to my portfolio website repository! This project showcases my work, skills, and professional journey in a visually engaging and user-friendly manner. Built with Nextjs and TypeScript, featuring GSAP animations, and hosted on Vercek, this site serves as a dynamic and interactive representation of my professional life.

Check out the [Website](https://tunkeltesch.dev).

## Project Overview
The website is designed to provide an overview of my experience, projects, and accomplishments. It features several sections, including About Me, Projects. All displayed information is managed through a central data.json file, making it easy to update and maintain.


### Key Features
- About Me: Detailed information about my education, skills, and interests.
- Projects: A comprehensive list of my projects with descriptions, technologies used, and links to live demos and source code.

### Technologies Used
- Frontend: Nextjs, React, TypeScript, GSAP for animations, CSS for styling
- Backend: For now the data is managed entirely through data.json for dynamic content updates
- Deployment: Vercel

### Design and Data Management
The entire website's content is driven by a single data.json file. This design choice allows for easy modifications and the potential for the website to be reused by others with minimal changes. Here is an excerpt of the data.json file structure:

```json
{
    "name": "Tun Keltesch",
    "title": "Project Engineer | Software Engineer",
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

### Ongoing Improvements

- The chat experience on mobile devices is not ideal yet. Mobile users are presented with a full-screen chat interface, making it difficult to notice when the website navigates in the background.
- I am iterating on the navigation functionality while experimenting with additional use cases where the AI can autonomously make decisions and call other frontend functions.

## Future Plans

- [x] A description of the website's development process
- [x] An AI chatbot to assist with navigation and answering questions about me
- [ ] New TK CHAT features and use cases.
- [x] Switch from github hosting to vercel.
- [x] Rebuild the Frontend with nextjs.
- [ ] Add missing Projects that make sense to be showcases.
- [ ] Data Management through an App on my phone. For this we will bring the Data to the backend probably into a simple SQLLite DB.

## Contact
For any feedback, ideas, questions, or inquiries, feel free to reach out to me via Email or connect with me on LinkedIn.

Thank you for visiting my portfolio website repository! Your feedback and support are greatly appreciated.

---
