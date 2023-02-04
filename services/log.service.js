import chalk from 'chalk'
import dedent from 'dedent-js'

const printError = (error) => {
    console.log(`${chalk.bgRed('Error')} ${error}`)
}

const printSuccess = (message) => {
    console.log(`${chalk.bgGreen('SUCCESS')} ${message}`)
}

const printHelp = () => {
    console.log(
        dedent(`${chalk.bgCyan(' HELP ')}
        Parametry wyjścia pogodowego
        -s [CITY] ustawić miasto
        -h wycofać pomoc
        -t [API_KEY] zapisać token
        `)
    )
}

const printWeather = (res, icon) => {
    console.log(
        dedent(`${chalk.bgYellow(' POGODA ')} Pogoda w ${res.name} 
        ${icon} ${res.weather[0].description}
        Temperatura: ${res.main.temp} (czuje się jak ${res.main.feels_like})
        Wologa ${res.main.humidity}%
        Szybkość wiatra ${res.wind.speed}
        `)
    )
}

export { printSuccess, printError, printHelp, printWeather }


/* 4cf9f92af31aaba31f5e3d2a7c82f8e1
Сервисы для вывода чего-то в консоль

 HELP
        Без параметров вывод погоды
        -s [CITY] для установки города
        -h для вывода помощи
        -t [API_KEY] для сохранения токена
Этот противный отступ возникает потому что здесь в коде он есть
console.log(
        `${chalk.bgCyan(' HELP ')}
        Без параметров вывод погоды
        -s [CITY] для установки города
        -h для вывода помощи
        -t [API_KEY] для сохранения токена
        `
    )
Можно это пофиксить просто перенеся это в начало строки
console.log(
`${chalk.bgCyan(' HELP ')}
Без параметров вывод погоды
-s [CITY] для установки города
-h для вывода помощи
-t [API_KEY] для сохранения токена
`
    )
Но это не красиво
Воспользуемся библиотекой которая уберает лишнии отступы
Обернем текст в dedent()
*/