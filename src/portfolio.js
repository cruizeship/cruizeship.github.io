/* Change this file to get your personal Portfolio */

// To change portfolio colors globally go to the  _globalColor.scss file

import emoji from "react-easy-emoji";
import splashAnimation from "./assets/lottie/splashAnimation"; // Rename to your file name for custom animation

// Splash Screen

const splashScreen = {
  enabled: false, // set false to disable splash screen
  animation: splashAnimation,
  duration: 2000 // Set animation duration as per your animation
};

// Summary And Greeting Section

const illustration = {
  animated: false // Set to false to use static SVG
};

const greeting = {
  username: "Andrew Cruz",
  title: "Hello! I'm Andrew",
  subTitle: emoji(
    "I am a student studying computer science at UCLA 🐻. In my free time, I enjoy playing tennis, listening to music, and hanging out with my two younger brothers. Feel free to reach out!"
  ),
  resumeLink:
    "https://drive.google.com/file/d/1ofFdKF_mqscH8WvXkSObnVvC9kK7Ldlu/view?usp=sharing", // Set to empty to hide the button
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/cruizeship",
  linkedin: "https://www.linkedin.com/in/andrewcruz3/", //https://www.linkedin.com/in/andrew-cruz-43b098202/
  gmail: "andrew.cruz.2027@gmail.com",
  //gitlab: "https://gitlab.com/saadpasta",
  //facebook: "https://www.facebook.com/saad.pasta7",
  medium: "https://medium.com/@andrew.cruz",
  //stackoverflow: "https://stackoverflow.com/users/10422806/saad-pasta",
  // Instagram, Twitter and Kaggle are also supported in the links!
  // To customize icons and social links, tweak src/components/SocialMedia
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "What I do",
  subTitle: "CRAZY FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
  skills: [
    emoji(
      "⚡ Develop highly interactive Front end / User Interfaces for your web and mobile applications"
    ),
    emoji("⚡ Progressive Web Applications ( PWA ) in normal and SPA Stacks"),
    emoji(
      "⚡ Integration of third party services such as Firebase/ AWS / Digital Ocean"
    )
  ],

  /* Make Sure to include correct Font Awesome Classname to view your icon
https://fontawesome.com/icons?d=gallery */

  softwareSkills: [
    {
      skillName: "html-5",
      fontAwesomeClassname: "fab fa-html5"
    },
    {
      skillName: "css3",
      fontAwesomeClassname: "fab fa-css3-alt"
    },
    {
      skillName: "sass",
      fontAwesomeClassname: "fab fa-sass"
    },
    {
      skillName: "JavaScript",
      fontAwesomeClassname: "fab fa-js"
    },
    {
      skillName: "reactjs",
      fontAwesomeClassname: "fab fa-react"
    },
    {
      skillName: "nodejs",
      fontAwesomeClassname: "fab fa-node"
    },
    {
      skillName: "swift",
      fontAwesomeClassname: "fab fa-swift"
    },
    {
      skillName: "npm",
      fontAwesomeClassname: "fab fa-npm"
    },
    {
      skillName: "sql-database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "aws",
      fontAwesomeClassname: "fab fa-aws"
    },
    {
      skillName: "firebase",
      fontAwesomeClassname: "fas fa-fire"
    },
    {
      skillName: "python",
      fontAwesomeClassname: "fab fa-python"
    },
    {
      skillName: "docker",
      fontAwesomeClassname: "fab fa-docker"
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Education Section

const educationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "UCLA",
      logo: require("./assets/images/UCLAlogo.png"),
      subHeader: "BS in Computer Science",
      duration: "Class of 2027",
      desc: "Activities: UCLA DevX, DataRes Consulting, Association of Chinese Americans",
      /*descBullets: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
      ]*/
    },
    {
      schoolName: "Carlmont High School",
      logo: require("./assets/images/Carlmontlogo.jpg"),
      subHeader: "High School Diploma",
      duration: "Class of 2023",
      desc: "Activities: Computer Science Club, Product Design Club, Varsity Tennis",
    }
  ]
};

// Your top 3 proficient stacks/tech experience

const techStack = {
  viewSkillBars: false, //Set it to true to show Proficiency Section
  experience: [
    {
      Stack: "Frontend/Design", //Insert stack or technology you have experience in
      progressPercentage: "90%" //Insert relative proficiency in percentage
    },
    {
      Stack: "Backend",
      progressPercentage: "70%"
    },
    {
      Stack: "Programming",
      progressPercentage: "60%"
    }
  ],
  displayCodersrank: false // Set true to display codersrank badges section need to changes your username in src/containers/skillProgress/skillProgress.js:17:62, defaults to false
};

// Work experience section

const workExperiences = {
  display: true, //Set it to true to show workExperiences Section
  experience: [
    {
      role: "Software Engineer Intern",
      company: "Roblox",
      companylogo: require("./assets/images/Robloxlogo.jpg"),
      date: "Jun 2025 - Present",
      desc: "Creator Data Services",
      descBullets: [
        "High-throughput data types for Roblox Luau"
      ]
    },
    {
      role: "Software Engineer Intern",
      company: "Apple",
      companylogo: require("./assets/images/Applelogo.png"),
      date: "Jun 2025 - Sep 2025",
      desc: "Digital Supply Chain",
      descBullets: [
        "Full-stack for AppleTV+, Fitness+, Sports, etc."
      ]
    },
    {
      role: "Software Engineer Intern",
      company: "Lockheed Martin",
      companylogo: require("./assets/images/Lockheedlogo.png"),
      date: "Jun 2022 – Jun 2025",
      desc: "Enterprise Interoperability Framework",
      descBullets: [
        "Microservices for internal enterprise tooling"
      ]
    },
    /*{
      role: "Software Engineer Intern",
      company: "Airbnb",
      companylogo: require("./assets/images/airbnbLogo.png"),
      date: "Jan 2015 – Sep 2015",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    }*/
  ]
};

/* Your Open Source Section to View Your Github Pinned Projects
To know how to get github key look at readme.md */

const openSource = {
  showGithubProfile: "true", // Set true or false to show Contact profile using Github, defaults to true
  display: false // Set false to hide this section, defaults to true
};

// Some big projects you have worked on

const bigProjects = {
  title: "Featured",
  subtitle: "Some things I have been building on the side",
  projects: [
    {
      image: require("./assets/images/Retunelogo.png"),
      projectName: "Retune",
      projectDesc:
        "",
      footerLink: [
        {
          name: "Visit Website",
          url: "https://retuneapp.com/"
        }
      ]
    }
  ],
  display: true
};

const contractProjects = {
  title: "Contract Projects",
  subtitle: "Projects for startups",
  projects: [
    {
      image: require("./assets/images/Kickbacklogo.png"),
      projectName: "Kickback",
      projectDesc: "Web traffic analtyics and A/B testing. Project through UCLA Datares.",
      footerLink: [
        {
          name: "Visit Website",
          url: "https://drinkkickback.com/"
        }
      ]
    },
    {
      image: require("./assets/images/Improperlogo.png"),
      projectName: "Improper Etiquette",
      projectDesc: "Supply chain research and data analysis. Project through UCLA Datares.",
      footerLink: [
        {
          name: "Visit Website",
          url: "https://improper.org/"
        }
        //  you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/Chellelogo.png"),
      projectName: "Chelle AI",
      projectDesc: "LLM training and evaluation for chatbot development. Project through UCLA Datares.",
      footerLink: [
        {
          name: "Visit Website",
          url: "http://saayahealth.com/"
        }
        //  you can add extra buttons here.
      ]
    },
  ],
  display: false // Set false to hide this section, defaults to true
};

// Achievement Section
// Include certificates, talks etc

const achievementSection = {
  title: emoji("Achievements And Certifications 🏆 "),
  subtitle:
    "Achievements, Certifications, Award Letters and Some Cool Stuff that I have done !",

  achievementsCards: [
    {
      title: "Google Code-In Finalist",
      subtitle:
        "First Pakistani to be selected as Google Code-in Finalist from 4000 students from 77 different countries.",
      image: require("./assets/images/codeInLogo.webp"),
      imageAlt: "Google Code-In Logo",
      footerLink: [
        {
          name: "Certification",
          url: "https://drive.google.com/file/d/0B7kazrtMwm5dYkVvNjdNWjNybWJrbndFSHpNY2NFV1p4YmU0/view?usp=sharing"
        },
        {
          name: "Award Letter",
          url: "https://drive.google.com/file/d/0B7kazrtMwm5dekxBTW5hQkg2WXUyR3QzQmR0VERiLXlGRVdF/view?usp=sharing"
        },
        {
          name: "Google Code-in Blog",
          url: "https://opensource.googleblog.com/2019/01/google-code-in-2018-winners.html"
        }
      ]
    },
    {
      title: "Google Assistant Action",
      subtitle:
        "Developed a Google Assistant Action JavaScript Guru that is available on 2 Billion devices world wide.",
      image: require("./assets/images/googleAssistantLogo.webp"),
      imageAlt: "Google Assistant Action Logo",
      footerLink: [
        {
          name: "View Google Assistant Action",
          url: "https://assistant.google.com/services/a/uid/000000100ee688ee?hl=en"
        }
      ]
    },

    {
      title: "PWA Web App Developer",
      subtitle: "Completed Certifcation from SMIT for PWA Web App Development",
      image: require("./assets/images/pwaLogo.webp"),
      imageAlt: "PWA Logo",
      footerLink: [
        {name: "Certification", url: ""},
        {
          name: "Final Project",
          url: "https://pakistan-olx-1.firebaseapp.com/"
        }
      ]
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Blogs Section

const blogSection = {
  title: "Articles",
  subtitle: "",
  displayMediumBlogs: "true", // Set true to display fetched medium blogs instead of hardcoded ones
  blogs: [
    {
      url: "https://blog.usejournal.com/create-a-google-assistant-action-and-win-a-google-t-shirt-and-cloud-credits-4a8d86d76eae",
      title: "Win a Google Assistant Tshirt and $200 in Google Cloud Credits",
      description:
        "Do you want to win $200 and Google Assistant Tshirt by creating a Google Assistant Action in less then 30 min?"
    },
    {
      url: "https://medium.com/@saadpasta/why-react-is-the-best-5a97563f423e",
      title: "Why REACT is The Best?",
      description:
        "React is a JavaScript library for building User Interface. It is maintained by Facebook and a community of individual developers and companies."
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Talks Sections

const talkSection = {
  title: "TALKS",
  subtitle: emoji(
    "I LOVE TO SHARE MY LIMITED KNOWLEDGE AND GET A SPEAKER BADGE 😅"
  ),

  talks: [
    {
      title: "Build Actions For Google Assistant",
      subtitle: "Codelab at GDG DevFest Karachi 2019",
      slides_url: "https://bit.ly/saadpasta-slides",
      event_url: "https://www.facebook.com/events/2339906106275053/"
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Podcast Section

const podcastSection = {
  title: emoji("Podcast 🎙️"),
  subtitle: "I LOVE TO TALK ABOUT MYSELF AND TECHNOLOGY",

  // Please Provide with Your Podcast embeded Link
  podcast: [
    "https://anchor.fm/codevcast/embed/episodes/DevStory---Saad-Pasta-from-Karachi--Pakistan-e9givv/a-a15itvo"
  ],
  display: false // Set false to hide this section, defaults to true
};

// Resume Section
const resumeSection = {
  title: "Resume",
  subtitle: "Feel free to download my resume",

  // Please Provide with Your Podcast embeded Link
  display: true // Set false to hide this section, defaults to true
};

const contactInfo = {
  title: emoji("Contact Me ☎️"),
  subtitle:
    "Discuss a project or just want to say hi? My Inbox is open for all.",
  number: "+92-0000000000",
  email_address: "saadpasta70@gmail.com"
};

const miscSection = {
  display: true,
  title: "More About Me",
  polaroids: [
    {
      caption: "July 4th 2026",
      image: require("./assets/images/polaroid-4.png"),
      position: {x: -50, y: -44, rotate: 0, zIndex: 10}
    },
    {
      caption: "Polaroid 5",
      image: require("./assets/images/polaroid-5.png"),
      position: {x: 0, y: -40, rotate: 0, zIndex: 20}
    },
    {
      caption: "Polaroid 6",
      image: require("./assets/images/polaroid-6.png"),
      position: {x: 44, y: -42, rotate: 0, zIndex: 30}
    },
    {
      caption: "Polaroid 7",
      image: require("./assets/images/polaroid-7.png"),
      position: {x: -46, y: 30, rotate: 0, zIndex: 40}
    },
    {
      caption: "Polaroid 9",
      image: require("./assets/images/polaroid-9.png"),
      position: {x: 2, y: 26, rotate: 0, zIndex: 50}
    },
    {
      caption: "Polaroid 8",
      image: require("./assets/images/polaroid-8.png"),
      position: {x: 46, y: 32, rotate: 0, zIndex: 60}
    },
    {
      caption: "Polaroid 10",
      image: require("./assets/images/polaroid-10.png"),
      position: {x: -40, y: -20, rotate: 0, zIndex: 15}
    },
    {
      caption: "Polaroid 11",
      image: require("./assets/images/polaroid-11.png"),
      position: {x: 10, y: -28, rotate: 0, zIndex: 25}
    },
    {
      caption: "Polaroid 13",
      image: require("./assets/images/polaroid-13.png"),
      position: {x: 38, y: 8, rotate: 0, zIndex: 35}
    },
    {
      caption: "Polaroid 12",
      image: require("./assets/images/polaroid-12.png"),
      position: {x: -30, y: 18, rotate: 0, zIndex: 45}
    },
    {
      caption: "Polaroid 14",
      image: require("./assets/images/polaroid-14.png"),
      position: {x: 18, y: 40, rotate: 0, zIndex: 55}
    },
    {
      caption: "Polaroid 15",
      image: require("./assets/images/polaroid-15.png"),
      position: {x: -8, y: 36, rotate: 0, zIndex: 65}
    }
  ],
  funFacts: [
    {value: "Silver 3", label: "League of Legends Rank"},
    {value: "22%", label: "Competitive Spikeball Winrate"},
    {value: "157", label: "Beli Spots Rated in 2026"}
  ]
};

// Twitter Section

const twitterDetails = {
  userName: "twitter", //Replace "twitter" with your twitter username without @
  display: false // Set true to display this section, defaults to false
};

const isHireable = true; // Set false if you are not looking for a job. Also isHireable will be display as Open for opportunities: Yes/No in the GitHub footer

export {
  illustration,
  greeting,
  socialMediaLinks,
  splashScreen,
  skillsSection,
  educationInfo,
  techStack,
  workExperiences,
  openSource,
  bigProjects,
  contractProjects,
  achievementSection,
  blogSection,
  talkSection,
  podcastSection,
  contactInfo,
  miscSection,
  twitterDetails,
  isHireable,
  resumeSection
};
