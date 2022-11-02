import "./index.css";

const promoDate = document.querySelector(".header__promo-date");

const date = new Date();

// Получает дату ближайшего понедельника, и если сегодня понедельник, получает дату текущего понедельника
const dateToNextMonday = ((8 - date.getDay()) % 7);

// Получает дату ближайшего понедельника, и если сегодня понедельник, получает дату следующего понедельника
// const dateToNextMonday = ((8 - date.getDay()) % 7) || 7;

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const result = addDays(date, dateToNextMonday);
const formattedResult = `${result.getDate()}.${result.getMonth() + 1}.${result.getFullYear() - 2000}`;

promoDate.textContent = formattedResult;
