import './index.css';
import Card from '../components/Card.js';
import FormValidator from '../components/FormValidator.js';
import Section from '../components/Section.js';
import {
  editButton,
  addButton,
  editAvatarButton,
  nameInput,
  jobInput,
  formData
 } from '../utils/constants.js';
import PopupWithImage from '../components/PopupWithImage.js';
import PopupWithForm  from '../components/PopupWithForm.js';
import PopupWithConfirmation  from '../components/PopupWithConfirmation.js';
import UserInfo from '../components/UserInfo.js';
import Api from '../components/Api.js';

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-39',
  headers: {
    authorization: '21b633d6-0242-4229-923c-a9cd21579f97',
    'Content-Type': 'application/json'
  }
});

// Отрисовка карточек на странице
const cardsList = new Section({
  renderer: (cardItem, userId) => {  // cardItem = объект карточки с сервера
    cardsList.addItem(createCard(cardItem, userId));
  }
}, '.elements__container');


// Отображение корзинки удаления карточки
let userId;

Promise.all([api.getUserInfo(),api.getInitialCards()])
  .then(([userData, cards]) => { // cards = массив объектов карточке с сервера
    userId = userData._id;
    userInfo.setUserInfo(userData);

    cardsList.rendererItems(cards, userId); // Вызов функции renderer из класса Section
  })
  .catch((err) => {
    console.log(`${err}`);
  });

// Управление отображением информации профиля пользователя
const userInfo = new UserInfo('.profile__name', '.profile__job', '.profile__avatar');

// Объект с набором форм и аттрибутом name;
const formValidator = {};

// Включение валидации
const enableFormValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    const validator = new FormValidator(config, formElement);
    const formName = formElement.getAttribute('name');
    formValidator[formName] = validator;
    validator.enableValidation();
  });
}

enableFormValidation(formData);

// Попап с сообщением удаления карточки
const confirmPopup = new PopupWithConfirmation({
  popupSelector: '.popup_handle_remove-confirm',
  submitForm: () => {}
});

confirmPopup.setEventListeners();

const handleRemoveCard = (cardId, event) => {
  confirmPopup.open();
  confirmPopup.confirmDeleteCard(() => {
    api.deleteCard(cardId).then(() => {
      event.target.closest('.element').remove()
      confirmPopup.close();
    })
    .catch((err) => {
      console.log(`${err}`);
    });
  })
}

// Попап просмотра изображения
const imagePopup = new PopupWithImage('.popup_handle_image-viewing');
const handleCardClick = (name, link) => {
  imagePopup.open(name, link);
}
imagePopup.setEventListeners();

// Попап редактирования аватара
const avatarPopup = new PopupWithForm({
  popupSelector: '.popup_handle_edit-avatar',
  submitForm: (formValues) => {
    api.editAvatarInfo(formValues)
      .then((userData) => {
        userInfo.setUserInfo(userData);
        avatarPopup.close();
       })
       .catch((err) => {
        console.log(`${err}`);
      })
      .finally(()=>{
        avatarPopup.renderLoading(false);
      });
  }
});
avatarPopup.setEventListeners();

const createCard = (cardItem, userId)=> {
  const card = new Card(
    cardItem,
    '#element_template',
    handleCardClick,
    handleRemoveCard,
    {handleLikeClick: (id) => {
      if(card.isLiked()){
        api.removeLike(id)
          .then((res) => {
            card.setNewLikes(res.likes)
      })
      .catch((err) => {
        console.log(`${err}`);
      })
      } else {
        api.addLike(id)
          .then((res) => {
            card.setNewLikes(res.likes)
        })
        .catch((err) => {
          console.log(`${err}`);
        });
      }
    }},
    userId);
  return card.generateCard();
}


// Форма добавления карточки на страницу
const formAdd = new PopupWithForm({
  popupSelector: '.popup_handle_add-element',
  submitForm: (formValues) => {  //formValues =  Значение полей формы добавления карточки
    api.addCard(formValues)
      .then((res) => {
        cardsList.addItem(createCard(res, userId));  // Вставка готового элемента на страницу
        formAdd.close();
    })
    .catch((err) => {
      console.log(`${err}`);
    })
    .finally(()=>{
      formAdd.renderLoading(false);
    });
  }
})

formAdd.setEventListeners();

function openPopupAddElementForm () {
  //Деативация кнопки сабмита
  formValidator['cardform'].resetValidation();
  formAdd.open();
}

// Попап формы редактирования профиля
const formEdit = new PopupWithForm({
  popupSelector: '.popup_handle_profile',
  submitForm: (formValues) => {
    api.editUserInfo(formValues)
      .then((userData) => {
        userInfo.setUserInfo(userData);
        formEdit.close();
      })
      .catch((err) => {
        console.log(`${err}`);
      })
      .finally(()=>{
        formEdit.renderLoading(false);
      });
  }
});

formEdit.setEventListeners();

function openPopupEditForm () {
  //Деативация кнопки сабмита
  formValidator['profileform'].resetValidation();
  const userData = userInfo.getUserInfo();
  nameInput.value = userData['profile__name'];
  jobInput.value = userData['profile__job'];
  formEdit.open();
}

function openPopupEditAvatar () {
  //Деативация кнопки сабмита
  formValidator['avatarform'].resetValidation();
  avatarPopup.open();
}

// Добавить слушатели кнопкам открытия попапов редактирования профиля и добавления карточки
editButton.addEventListener('click', () => { openPopupEditForm()});
addButton.addEventListener('click', () => { openPopupAddElementForm()});
editAvatarButton.addEventListener('click', () => { openPopupEditAvatar()});

