import https from 'https';
import {getKeyValue, TOKEN_DICTIONARY} from "./storage.service.js";
import axios from "axios";

const getIcon = (icon) => {
    switch (icon.slice(0, -1)) {
        case '01':
            return '☀️';
        case '02':
            return '🌤️';
        case '03':
            return '☁️';
        case '04':
            return '☁️';
        case '09':
            return '🌧️';
        case '10':
            return '🌦️';
        case '11':
            return '🌩️';
        case '13':
            return '❄️';
        case '50':
            return '🌫️';
    }
};

const getWeather = async (city) => {
    const token = process.env.TOKEN ?? await getKeyValue(TOKEN_DICTIONARY.token) // по ключу ищем токен, передаем ключ и уже оно найдёт значение
    if (!token) {
        throw new Error('Klucz API nie jest ustawiony, ustaw klucz za pomocą polecenia -t [API_KEY]')
    }

    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            q: city,
            appid: token,
            lang: 'pl',
            units: 'metric'
        }
    })
    return data
    // const url = new URL('https://api.openweathermap.org/data/2.5/weather')
    // url.searchParams.append('q', city)
    // url.searchParams.append('appid', token)
    // url.searchParams.append('lang', 'ru')
    // url.searchParams.append('units', 'metric')
    //
    // https.get(url, (response) => {
    //     let res = ''
    //     response.on('data', (chunk) => {
    //         res += chunk
    //     })
    //
    //     response.on('end', () => {
    //         console.log(res)
    //     })
    //
    //     response.on('error', (error) => {
    //         console.log(error.message)
    //     })
    // })
}

export { getWeather, getIcon }

/*
Нам нужно АПИ для получение погоды что бы взаимодействовать с нашим АПИ

Важно знать что мы можем использовать вместо axios встроенную библиотеку https - https.get(`api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
Но у такого подхода есть минус, если мы будем использовать ее на реальном проекте то мы не защищены от иньекций из вне, то-есть нас могут ломануть

const url = new URL() - такой конуструктор позволяет нам сформировать юрл и добавлять туда какие-то параметры

url.searchParams - поможет нам получить либо отсортировать и в том числе апенд сделать, то-есть добавить дополнительные значение ?q=${city}&appid=${key}

url.searchParams.append('q', city)
    url.searchParams.append('appid', token)
    url.searchParams.append('lang', 'ru')
    url.searchParams.append('units', 'metric')

    https.get(url)
Таким образом мы добавили доп параметры к нашему get запросу

https.get(url, (response)
Респонс - это то что нам приходит в результате, когда будут приходить данные, мы можем на респонс подписаться и обогащать какие-то данные

Такой подход неудобный, потому что если мы хотим что-то вернуть с нашего Компонента getWeather нам нужно его весь обернуть в Promise, во внутрь передать resolve и reject, и если мы попадаем в response.on('end', () => { то делаем резолв, если в response.on('error', (error) то выдаем ошибку

//axios
axios.get возвращает axios.response в котором будут там данные, дополнительные реквесты, респонс, хедерсы, но так нам нужна только data то мы пишем { data }
*/