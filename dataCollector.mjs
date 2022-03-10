#!/usr/bin/env node
import CopticCalendar from "./calendar/CopticCalendar.mjs";
import events from "./calendar/events.mjs";
import got from 'got';
import jsdom from 'jsdom';
import fs from 'fs';
const { JSDOM } = jsdom;

const url = "https://www.copticchurch.net/readings/en?json=true";

let jsonObj = {};

const cleanText = (text) => {
    return text.trim().split(" ").slice(0, 6).join(" ") + "...";
}

const cleanPsalm = (text) => {
    return text.replace(/   /g, "&nbsp;&nbsp;&nbsp;&nbsp;");
}

const getReadings = (jsonData) => {
    /*
    Verse: Bible location (ex. book name)
    Section: Section of Bible (ex. 6 words)
    Order of readings:
        - Pauline
        - Catholic
        - Acts
        - Psalm
        - Gospel
        - Synaxarium
    */
    let readings = {};
    let links = [];

    readings['Pauline'] = {
        "verse": jsonData['pauline_ref'],
        "section": cleanText(jsonData['pauline_text'])
    };

    readings['Catholic'] = {
        "verse": jsonData['catholic_ref'],
        "section": cleanText(jsonData['catholic_text'])
    };

    readings['Acts'] = {
        "verse": jsonData['acts_ref'],
        "section": cleanText(jsonData['acts_text'])
    };

    readings['Psalm'] = {
        "verse": jsonData['psalm_ref'],
        "section": cleanPsalm(jsonData['psalm_text'])
    };

    readings['Gospel'] = {
        "verse": jsonData['gospel_ref'],
        "section": cleanText(jsonData['gospel_text'])
    };

    readings['Synaxarium'] = jsonData['synaxarium_a'];

    return readings;
}

function getFasts() {

    let ff = [];
    let date = new Date();

    let yearEvents = events[date.getFullYear()];
    for (let i = 0; i < yearEvents.length; i++) {
        let evt = yearEvents[i];
        let start = new Date(`${evt.startDate} 00:00:00`);
        let end = new Date(`${evt.endDate} 23:59:59`);
        if (start < date && end > date) {
            ff.push(`${evt.Title} ${evt.startDate.slice(0, -5)} \u2013 ${evt.endDate.slice(0, -5)}`)
        }
    }

    return ff;
}

async function getData() {
    var now = new Date();
    let response = await got(url);
    let jsonData = JSON.parse(response.body)['data'];
    // Get the readings and commemorations
    jsonObj = getReadings(jsonData);

    // Get Coptic Month & Day
    let cal = new CopticCalendar();
    let today = cal.today();
    jsonObj["monthCoptic"] = cal.monthNames[today.month() - 1];
    jsonObj["monthEnglish"] = cal.englishMonthNames[today.month() - 1];
    jsonObj["monthNumber"] = today.month();
    jsonObj["day"] = today.day();

    // Get images
    let imgs = [];
    fs.readdirSync('./public/images').forEach(file => {
        if (file.startsWith(`${today.month()}_${today.day()}`)) {
            imgs.push(file);
        }
    });

    jsonObj["imageLinks"] = imgs;


    // Get the fasts and feasts
    jsonObj["fastAndFeasts"] = getFasts();

    jsonObj["milliseconds"] = now.getTime();

    return jsonObj;
}

export { getData };
