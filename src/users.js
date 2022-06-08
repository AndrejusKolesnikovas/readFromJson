'use strict';

//HTTP requestų metodai: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
//HTTP headeriai: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers


// const usersData = '../data/users.json';
const usersData = 'https://furtive-resisted-toque.glitch.me/users';

export const getUsers = () =>
  fetch(usersData).then((response) => {
    if (!response.ok) {
      throw new Error('Įvyko klaida: ' + response.status);
    }
    return response.json();
  });

export const addUser = (data) =>
  fetch(usersData, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Įvyko klaida: ' + response.status);
    }
    return response.json();
  });

// export const getUsers = () => {
//     return fetch(usersData).then((response) => {
//         if(!response.ok) {
//             throw new Error('Įvyko klaida: ' + response.status)
//         }
//         return response.json();
//     });
//   };
