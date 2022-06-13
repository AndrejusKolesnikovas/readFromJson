'use strict';

import { getUsers, addUser } from './src/users.js';
import { getCountry } from './src/countries.js';

const tableBodyElement = document.querySelector('tbody');
const addUsersForm = document.querySelector('#addUsers form');
const searchResultsElement = document.querySelector('#searchResults');
const searchUsersForm = document.querySelector('#searchUsers form');
const sortBySurname = document.querySelector('#sortBySurname');
const sortByName = document.querySelector('#sortByName');
const getByMinMaxAge = document.querySelector('#getByMinMaxAge');

let users = [];

addUsersForm.addEventListener('submit', addNewElement);
getByMinMaxAge.addEventListener('click', getMinMaxAge);
searchUsersForm.addEventListener('submit', searchUsers);
sortBySurname.addEventListener('click', () => {
  sortBy('surname');
  arrangeData();
});

sortByName.addEventListener('click', () => {
  sortBy('name');
  arrangeData();
});

initDocument();

// function initDocument() {
//   getUsers().then((data) => {
//     users = data;
//     arrangeData();
//     appendFoot();
//   });
// }

//initDoc perrašytas, įtraukiant duomenų sumappinimą nuskaitant userius
function initDocument() {
  getUsers().then((data) => {
    let promises = data.map((user) => 
      
      getCountry(user.country).then((country) => {
        user.countryData = country[0];
        user.age = getAge(user.birthday);
        return user;
      })
    );
 
    Promise.all(promises).then((result) => {
      users = result;
      arrangeData();
      appendFoot();
    });
  });
}
// function initDocument() {
//   getUsers().then((data) => {
//     let promises = data.map((user) =>
//       getCountry(user.country).then((country) => {
//         user.countryData = country[0];
//         return user;
//       })
//     );
//     Promise.all(promises).then((result) => {
//       users = result;
//       console.log(users)
//       arrangeData();
//       appendFoot();
//     });
//   });
// }

// function arrangeData() {
//   let usersElements = '';
//   users.forEach((user) => {
//     if (user.country) {
//       getCountry(user.country)
//         .then((country) => {
//           usersElements += `<tr>
//         <td>${user.id}</td>
//         <td>${user.name}</td>
//         <td>${user.surname}</td>
//         <td><img src="${country[0].flags.png}" alt="${
//             country[0].flag
//           }" width="30"> ${user.country}, ${country[0].capital}</td>
//         <td>${new Date(user.added).toLocaleDateString()}</td>
//     </tr>`;
//         })
//         .then(() => (tableBodyElement.innerHTML = usersElements));
//     }
//   });
// }

//arrangeData perrašytas, naudojant jau sumappintus userius
function arrangeData() {
  let usersElements = '';
  users.forEach((user) => {
    if (user.country) {
      // const age = getAge(user.birthday);
      usersElements += `<tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.surname}</td>
          <td>${user.country}</td>
          <td>${user.age}</td>
          <td><img src="${user.countryData.flags.png}" alt="${
        user.countryData.flag
      }" width="30"> ${user.country}, ${user.countryData.capital}</td>
          <td>${new Date(user.added).toLocaleDateString()}</td>
      </tr>`;
      tableBodyElement.innerHTML = usersElements;
    }
  });
}

function addNewElement(event) {
  event.preventDefault();
  const name = addUsersForm.querySelector('#vardas');
  const surname = addUsersForm.querySelector('#pavarde');
  const country = addUsersForm.querySelector('#valstybe');
  const birthday = addUsersForm.querySelector('#gimimodata');
  const newId = getNewId();
  const newDate = new Date();

  const user = {
    id: newId,
    name: name.value,
    surname: surname.value,
    country: country.value,
    birthday: birthday.value,
    added: newDate,
  };

  addUser(user).then(() => {
    initDocument();
  });

  name.value = '';
  surname.value = '';
  country.value = '';
}

function getNewId() {
  const idsArray = users.map((user) => user.id);
  return Math.max(...idsArray) + 1;
}

function appendFoot() {
  const totalUsers = users.length;
  const tableFooterElement = document.querySelector('tfoot');
  const footElement = `<tr>
    <td colspan="2"><b>Iš viso vartotojų:</b></td>
    <td colspan="3">${totalUsers}</td>
  </tr>`;
  tableFooterElement.innerHTML = footElement;
}

function searchUsers(event) {
  event.preventDefault();
  searchResultsElement.value = '';
  const searchValue = searchUsersForm.querySelector('#paieska');
  if (searchValue.value) {
    const value = searchValue.value;
    const valueInBold = `<b>${value}</b>`;
    let searchResult = users.filter(
      (user) => user.name.includes(value) || user.surname.includes(value)
    );
    let searchElement = '';
    if (searchResult.length > 0) {
      searchElement += `<div><span>Rezultatai:</span></div>`;
      searchResult.forEach(
        (item) =>
          (searchElement += `<div>${item.id} ${item.name.replace(
            value,
            valueInBold
          )} ${item.surname.replace(value, valueInBold)} ${
            item.country
          } ${new Date(item.added).toLocaleDateString()}</div>`)
      );
    } else {
      searchElement = `<div>Rezultatų nerasta</div>`;
    }
    searchResultsElement.innerHTML = searchElement;
    searchValue.value = '';
  }
}

function sortBy(value) {
  users.sort(compare);
  function compare(a, b) {
    if (a[value] < b[value]) {
      return -1;
    }
    if (a[value] > b[value]) {
      return 1;
    }
    return 0;
  }
}

function getAge(birthday){
  const today = new Date();
  return today.getFullYear() - (new Date(birthday)).getFullYear();
};

function getMinMaxAge(){
  const minValue = users.reduce((min, curentValue) => Math.min(min, curentValue.age), users[0].age);
  const maxValue = users.reduce((max, curentValue) => Math.max(max, curentValue.age), users[0].age);
  console.log(minValue);
  console.log(maxValue);
};
