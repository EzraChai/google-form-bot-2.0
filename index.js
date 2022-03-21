#!/usr.bin/env node
import config from "config"
import moment from "moment"
import chalk from "chalk"
import inquirer from "inquirer"
import { createSpinner } from 'nanospinner'
import axios from "axios"

const Student = {
    studentName : "",
    studentClass : "",
    subject: ""
}

//  Get the current Date using moment.js
const currentDate = moment().toObject()
// pg 1 Q3,4 pg8 - p10

//  Get the config file from /config/default.json to get the student's name and the class
const getInfoFromConfig = async() => {
    Student.studentName = await config.get("name")
    Student.studentClass = await config.get("class")

    Student.studentName = Student.studentName.trim().toUpperCase()
    Student.studentClass = Student.studentClass.trim().toUpperCase()
}

//  Ask the user about the subject that will be going to fill up the form
const askSubject = async() =>{
    const answers = await inquirer.prompt({
        name: 'subject', 
        type: 'list',
        message: `What is the ${chalk.yellowBright(`current`)} ${chalk.underline('subject')}?`,
        choices: [
            'Bahasa Melayu',
            'Bahasa Inggeris',
            'Bahasa Cina',
            'Mathematics',
            'Additional Mathematics',
            'Biology',
            'Computer Science',
            'Account',
            'Physics',
            'Chemistry',
            'Sejarah',
            'Pendidikan Moral',
            'Pendidikan Jasmani & Kesiihatan',
        ]
    })

    Student.subject = answers.subject
}

//  Handle the subject byy changing the subject that are written in English word to Bahasa Melayu
const handleSubject = () => {
    switch (Student.subject) {
        case "Mathematics":
                Student.subject = "MATEMATIK"
            break;
        case "Additional Mathematics":
                Student.subject = "MATEMATIK TAMBAHAN"
                break
        case 'Biology':
            Student.subject = "BIOLOGI"
            break
        case 'Computer Science':
            Student.subject = "SAINS KOMPUTER"
            break
        case 'Account':
            Student.subject = "PRINSIP PERAKAUNAN"
            break
        case 'Physics':
            Student.subject = "FIZIK"
            break
        case 'Chemistry':
            Student.subject = "KIMIA"
            break
        default:
            Student.subject = Student.subject.toUpperCase()
            break;
    }
}

//  Sleep function, default is 2seconds
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

//  Send the form using axios
const sendForm = async() => {
    await sleep(100)

    console.log(`\n${ chalk.bold(chalk.redBright('Date   :'))} ${chalk.bold(`${currentDate.date}-${currentDate.months + 1}-${currentDate.years}`)}`)
    console.log(`${ chalk.bold(chalk.yellow('Name   :'))} ${chalk.bold(`${Student.studentName}`)}`)
    console.log(`${ chalk.bold(chalk.greenBright('Class  :'))} ${chalk.bold(Student.studentClass)}`)
    console.log(`${ chalk.bold(chalk.magentaBright('Subject:'))} ${chalk.bold(Student.subject)}\n`)

    //  Create a spinner
    const spinner = createSpinner('Submiting...').start()

    const params = new URLSearchParams();
    params.append('entry.1222343424_year', currentDate.years);
    params.append('entry.1222343424_month', currentDate.months + 1);
    params.append('entry.1222343424_day', currentDate.date);
    params.append('entry.838936141', Student.subject);
    params.append('entry.905981787', 'TINGKATAN 5');
    params.append('entry.2081836409', Student.studentClass);
    params.append('entry.1627675938', Student.studentName);
    params.append('pageHistory', '0,1,7,42');


    //  Submit the form  with parameters via axios
    await axios.post('https://docs.google.com/forms/u/1/d/e/1FAIpQLSeRpuWL1hTLilGH2E5Bz39BuQcZ9qCTHBBauwfmVFkWsok0QA/formResponse',params)
    .then((res) => {
        if (res.status == 200 ){
            spinner.success()
            return
        }
    })
    console.log("")
}


await getInfoFromConfig()
await askSubject()
await handleSubject()
await sendForm()