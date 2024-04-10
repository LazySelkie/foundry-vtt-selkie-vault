// Макрос для броска Знамения для Эноа. Показывает сколько каких животных выпало, а также какой номер знамения этому соответствует (чтобы быстро глянуть в таблицу и найти нужную строчку)
// Для донастройки надо в строчках с 6 по 9 включительно указать в кавычках путь к изображениям нужных животных

const diceToAnimals = ["Бунти", "Аюр", "Додор", "Тахар"];
const animalsToImg = {
    "Бунти": "тут путь к изображению",
    "Аюр": "тут путь к изображению",
    "Додор": "тут путь к изображению",
    "Тахар": "тут путь к изображению"
}
// Это сопоставление строки таблицы сколько раз какое животное выпало с номером знамения. Менять не надо
const dicesToTable = {
    "4000": 1,
    "0004": 2,
    "0040": 3,
    "0400": 4,
    "3100": 5,
    "3010": 6,
    "3001": 7,
    "2110": 8,
    "2011": 9,
    "2101": 10,
    "2200": 11,
    "2020": 12,
    "2002": 13,
    "1300": 14,
    "1030": 15,
    "1003": 16,
    "1210": 17,
    "1120": 18,
    "1102": 19,
    "1201": 20,
    "1111": 21,
    "0211": 22,
    "0220": 23,
    "0202": 24,
    "0121": 25,
    "0112": 26,
    "0130": 27,
    "0103": 28,
    "0031": 29,
    "0022": 30,
    "0013": 31,
    "0310": 32,
    "0301": 33,
    "1012": 34,
    "1021": 35,
}

let dice1 = await new Roll(`1d4`).roll();
let dice2 = await new Roll(`1d4`).roll();
let dice3 = await new Roll(`1d4`).roll();
let dice4 = await new Roll(`1d4`).roll();
const rolledDices = [dice1.total, dice2.total, dice3.total, dice4.total];

// Тут лежит информация сколько костей какого зверя выпало (будет лежать)
const dices = {
    "Бунти": 0,
    "Аюр": 0,
    "Додор": 0,
    "Тахар": 0
};
for (let d of rolledDices) {
    dices[diceToAnimals[d - 1]]++;
}

let tableAmountRow = "";
let imagesString = "";
let tableNameRow = "";
for (let animal in dices) {
    if (dices[animal] > 0) {
        tableAmountRow += `<th scope="col" width="100" style="text-align: center;">${dices[animal]}</th>`
        imagesString += `<td style="text-align: center;"><img width="100" height="100" src="${animalsToImg[animal]}"></td>`;
        tableNameRow += `<td style="text-align: center;">${animal}</td>`
    }
}

// Подготовка к вытягиванию знамения из таблицы
let omenKey = "";
for (let animal in dices) {
    omenKey += dices[animal];
}
const omen = dicesToTable[omenKey];


new Dialog({
    title: `Знамение`,
    content: 
        `<div>
            <table>
                <thead>
                    <tr>${tableAmountRow}</tr>
                </thead>
                <tbody>
                    <tr>${imagesString}</tr>
                    <tr>${tableNameRow}</tr>
                </tbody>
            </table>
            <p>Полученное знамение: ${omen}</p>
        </div>`,
    buttons: {
        close: {label: "Закрыть диалог", callback: () => {
        }},
    },
    default: "close"
}).render(true);
