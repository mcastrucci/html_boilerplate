/*
 * @Author Mcatrucci - Program to create a boilPlate of HTML, CSS and JS
 */
const fs = require("fs");
const pathModule = require('path')
const project = {};

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

//This is a generic function to aska  question and get an input from the user
//it returns a promise
const question = (message) => new Promise((resolve, reject) => {
    try {
      readline.question(
        message,
        (response, reject) => {
          resolve(response);
        }
      );
    } catch (ex) {
      console.log("error while getting user output");
      reject("error!");
    }
 });

//we execute an async question and wait for the response
const runQuestion = async (message) => {
  return await question(message);
};

const checkYesNoResponse = result => {
  if ((result && result === "y") || result === "n") {
    if (result === "n") {
      return false;
    } else if (result === "y") {
      return true;
    }
  } else {
     return "notGood";
  }  
}

const runConfirmBlock = async () => {
  let confirmation = await runQuestion("Confirm? Y/N ");
  confirmation = await checkYesNoResponse(confirmation);
  if (confirmation === "notGood")
    confirmation = await runConfirmBlock();
  else
    return confirmation;
}

const runQuestionsAsync = async () => {
  const path = await runQuestion("where should the project be stored? ");
  project.path = path;
  
  const name = await runQuestion("What should be the name of the project? ");
  project.name = name;
  
  console.log(`The project name is ${project.name} and it will be stored on ${project.path}, is this right? `);
  let userConfirmed = await runConfirmBlock();
  
  await console.log(userConfirmed)
  if (!userConfirmed){
   process.exit(1);
  }
  console.log(project.toString());
  return project;
};

const writeFile = async (path, name) => {
  await fs.writeFile(`${path}\\${name}`, "", (err) =>{
    if(err)
      console.log(err)
      return;
   });
}

const buildPath = async (projectConfiguration) => {
    try {
    if (fs.existsSync(projectConfiguration.path)){
      console.log("creating directory...");
      const buildPath = `${projectConfiguration.path}\\${projectConfiguration.name}`;
      await fs.mkdirSync(buildPath);
      console.log("done.");
      console.log("creating css files...");
      await writeFile(buildPath, "main.css");
      console.log("done.");
      console.log("creating js files...");
      await writeFile(buildPath, "main.js");
      console.log("done.");
      console.log("creating html files...");
      await writeFile(buildPath, "index.html");
      console.log("done.");
      console.log("success!");
      process.exit(1);
    }  
    else
      throw new Error("dir already exist");
  } catch (err) {
    console.error(err)
  }
}
//readline.close();
runQuestionsAsync().then(projectConfiguration => {
  buildPath(projectConfiguration);
});

