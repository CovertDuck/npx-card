#!/usr/bin/env node

import boxen from "boxen";
import chalk from "chalk";
import clear from "clear";
import inquirer from "inquirer";
import fs from "fs";
import path from "path";
import open from "open";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// #region Functions
function loadData() {
    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath).toString();
    const data = JSON.parse(rawData);
    return data;
}

function prependSpaces(input: string): string {
    const colonPosition = 15;
    const prependSpaces = colonPosition - input.length;
    const spaces = " ".repeat(prependSpaces > 0 ? prependSpaces : 0);
    return spaces + chalk.bold.white(input.slice(0, prependSpaces + 1) + ":");
}

function justifyText(input: string, keywords: string[]): string {
    const maxLineLength = 50;
    const words = input.split(" ");
    let currentLine = "";
    let output = "";
    for (let i = 0; i < words.length; i++) {
        if (currentLine.length + words[i].length < maxLineLength) {
            currentLine += words[i] + " ";
        } else {
            output += currentLine + "\n";
            currentLine = words[i] + " ";
        }
    }
    output += currentLine;

    for (let keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, "g");
        output = output.replace(regex, chalk.bold.yellowBright(keyword));
    }

    return output;
}

function showCard() {
    clear();
    console.log(me);
}

function showPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Want to know more about me?",
            choices: [
                promptLabels.email,
                promptLabels.portfolio,
                promptLabels.exit
            ]
        }
    ]).then((answers) => {
        if (answers.action === promptLabels.email) {
            open(`mailto:${data.email}`);
            exit();
        } else if (answers.action === promptLabels.portfolio) {
            open(data.portfolio);
            exit();
        } else {
            exit();
        }
    });
}

function exit() {
    clear();
    process.exit();
}
// #endregion

// #region Labels
const data = loadData();

const labels = {
    fullName: `${chalk.bold.green(data.firstName)} \"${data.handle}\" ${chalk.bold.green(data.lastName)}`,
    currentJob: `${chalk.white(data.workRole)} @ ${chalk.hex("#2b82b2").bold(data.workPlace)}`,
    twitterLink: `${prependSpaces("Twitter")} ${chalk.gray("https://twitter.com/")}${chalk.cyan(data.twitterHandle)}`,
    githubLink: `${prependSpaces("GitHub")} ${chalk.gray("https://github.com/")}${chalk.green(data.githubHandle)}`,
    linkedinLink: `${prependSpaces("LinkedIn")} ${chalk.gray("https://linkedin.com/in/")}${chalk.blue(data.linkedinHandle)}`,
    websiteLink: `${prependSpaces("Website")} ${chalk.cyan(data.website)}`,
    npxLink: `${prependSpaces("Card")} ${chalk.red("npx")} ${chalk.white(data.npxCard)}`,
    formattedBlurb: `${chalk.italic(justifyText(data.blurb, data.blurbKeywords))}`
}

const promptLabels = {
    email: "📧 Send me an email",
    portfolio: "💾 Explore my portfolio",
    exit: "🚪 Exit"
}
// #endregion

// #region Card
const me = boxen(
    [
        `${labels.fullName}`,
        `${labels.currentJob}`,
        ``,
        `${labels.twitterLink}`,
        `${labels.githubLink}`,
        `${labels.linkedinLink}`,
        `${labels.websiteLink}`,
        ``,
        `${labels.npxLink}`,
        ``,
        `${labels.formattedBlurb}`
    ].join("\n"),
    {
        margin: 2,
        float: "center",
        padding: 1,
        borderStyle: "round",
        borderColor: "green"
    }
);
// #endregion

// #region Main
showCard();
showPrompt();
// #endregion
