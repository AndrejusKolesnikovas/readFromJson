'use strict';

const countriesData = 'https://restcountries.com/v3.1';

export const getCountry = async (name) =>
  await fetch(countriesData + "/name/" + name).then((response) => {
    if (!response.ok) {
      throw new Error('Įvyko klaida: ' + response.status);
    }
    return response.json();
  });

  export const getAllCountries = async (name) =>
  await fetch(countriesData + "/all").then((response) => {
    if (!response.ok) {
      throw new Error('Įvyko klaida: ' + response.status);
    }
    return response.json();
  });