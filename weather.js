import { getArgs } from './helpers/args.js'
import {printHelp, printSuccess, printError, printWeather} from "./services/log.service.js";
import {getKeyValue, saveKeyValue, TOKEN_DICTIONARY} from './services/storage.service.js'
import {getWeather, getIcon} from "./services/api.service.js";

const saveToken = async (token) => {
    //сделаем асинхронной что бы поймать ошибку если она будет
    if (!token.length) {
       return printError(`Błąd: token nie został przekazany`)
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.token, token)
        printSuccess('Token zachowany')
    } catch (e) {
        printError(`Błąd: ${e.message}`)
    }

}

const saveCity = async (city) => {
    const {name} = await getWeather(city)
    if (!name || /[0-9]/.test(name)) {
        return printError(`Nie poprawne podane miasto`)
    }
    try {
        await saveKeyValue(TOKEN_DICTIONARY.city, city)
        printSuccess(`Miasto zachowane`)
    } catch (e) {
        printError(`Błąd: ${e.message}`)
    }
}

const getForecast = async () => {
    try {
        const city = process.env.CITY ?? await getKeyValue(TOKEN_DICTIONARY.city)
        const weather = await getWeather(city)
        printWeather(weather, getIcon(weather.weather[0].icon))
    } catch (e) {
        if (e?.response?.status === 404) {
            printError('Nie poprawnie jest wkazane miasto')
        } else if (e?.response?.status === 401) {
            printError('Nie poprawnie jest wkazany token')
        } else {
            printError(e.message)
        }
    }

}

const initCli = () => {
    const args = getArgs(process.argv)

    if (args.h) {
        return printHelp()
    }

    if (args.s) {
        return saveCity(args.s)
    }

    if (args.t) {
        return saveToken(args.t)
    }
    getForecast()
}
initCli()
/*
Как нам получить аргументы командной строки - для этого есть process - глобальная переменная, которая содержит в себе различные параметры: директорию, архитерктуру, то-есть то что происходит с нашим процессом. И в этом же процессе находятся аргументы командной строки которую мы передадим process.argv
[
  '/Users/Ruslan/.nvm/versions/node/v16.17.0/bin/node',
  '/Users/Ruslan/Desktop/Work/larichev-nodejs/first-project/weather.js'
]
Это массив, где мы видим что первый аргумент - это то чем оно запускается, в нашем случае бинарник Ноды
Второй аргумент - это сам файл, который является точкой входа в weather.js
Если добавим другие аргументы к примеру 2rd 3rd то они просто добавятся в массив
[
  '/Users/Ruslan/.nvm/versions/node/v16.17.0/bin/node',
  '/Users/Ruslan/Desktop/Work/larichev-nodejs/first-project/weather.js',
  '2nd',
  '3rd'
]

Если мы передадим в package.json type: "module" то нода будет понимать что у нас импорты и экспорты будут модульними и нам не нужно дописывать mjs к файлу

Создав фцию saveToken мы тем самым распределили зону отвественности, мы не делаем try catch в storage.service

//
Перменные окружения
Сейчас мы сохраняем наш токен в специальном файле json, который храним в документах
В целом это удобно, но иногда нам нужно использовать наше переменное окружение в разных приложениях
К примеру у нас есть много разных микросервиссов и мы хотим здавать одно и тоже окружение и что мы находимся на девелопменте, а не продакшене, а не инвайромент и это было бы удобно создавать через какуе-то глобальную настройку, которая бы распростронялась на всю операционую систему, а не на конкретное приложение
Для этого существует наше переменное окружение, которое существует в рамах нашего баш исполнения или zsh исполнения командной строки, в которую мы можем добавлять при запуске
Кроме этого мы можем в ручную прокидывать дополнительные переменные окружения в рамках NodeJS
Как вообще их вывести
process.env
env - это переменное окружение которое у нас присутствует
Если мы сейчас выведем в консоль то увидим огромное количество переменных окружений который сейчас доступны в моей операционной системе

Так же мы можем что-то добавить в переменное окружение, достаточно прописать что-то перед: TEST=1 node weather.js
И теперь появится переменная Тест которая ровна 1

Как бы мы могли использовать это в наших целях
К примеру могли бы использовать это как в дополнительных откладочных токенах
TOKEN=4cf9f92af31aaba31f5e3d2a7c82f8e1 node weather.js
Чтобы не сохранять что-то а отлаживать
Теперь в аписервис мы можем к нему обратиться через process.env.TOKEN и если он есть то берем от него если нет то из нашего дикшенори
process.env.TOKEN ?? await getKeyValue(TOKEN_DICTIONARY.token)

//
e?.response?.status === 404 - это опшинал чейнинг, если у нас без этого не будет объекта Респонс, то обратившись к статусу мы соотвественно получим ексешпин ошибку, в данном случае это будет просто проверенно что такого нету, это будет андефайнд
*/