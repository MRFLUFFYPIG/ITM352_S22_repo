// Case Test Information
var birthdayMonth = 'March';
var day = 15;
var year = 1998;

// monthKey array
monthKey = {
    January:0,
    Febuary:3,
    March:2,
    April:5,
    May:0,
    June:3,
    July:5,
    August:1,
    September:4,
    October:6,
    November:2,
    December:4
};

// day of the week array
dayOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

// Flowchart Steps
step1 = (birthdayMonth == 'January' || birthdayMonth == 'Febuary')?(year - 1):year;
step2 = step1 + parseInt(step1/4);
step3 = step2 - parseInt(step1/100);
step4 = step3 + parseInt(step1/400);
step5 = day + step4;
step6 = monthKey[birthdayMonth] + step5;
step7 = step6%7;

// Print to the console
console.log(`${birthdayMonth} ${day} ${year} was on a ${dayOfTheWeek[step7]}`);