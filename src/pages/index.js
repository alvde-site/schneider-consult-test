import './index.css';

const promoDate = document.querySelector('.header__promo-date');

const date = new Date();
const DayToNextMonday = date.setDate(date.getDate() + (7 - date.getDate()) % 7);
const nextMonday = new Date(DayToNextMonday);
const newDate = `${nextMonday.getDate()}.${nextMonday.getMonth()}.${nextMonday.getFullYear() - 2000}`;
console.log(newDate)




promoDate.textContent = newDate;
