import { homedir } from 'os'
import { join } from 'path'
import { promises } from 'fs'

const filePath = join(homedir(), 'weather-data.json')

const TOKEN_DICTIONARY = {
    token: 'token',
    city: 'city'
}

const saveKeyValue = async (key, value) => {
    let data = {}
    if (await isExist(filePath)) {
        const file = await promises.readFile(filePath)
        data = JSON.parse(file)
    }
    data[key] = value//получае ключ значение
    await promises.writeFile(filePath, JSON.stringify(data))
}

const getKeyValue = async (key) => {
    if (await isExist(filePath)) {
        const file = await promises.readFile(filePath)
        const data = JSON.parse(file)
        return data[key]
    }
    return undefined
}

const isExist = async (path) => {
    //нужно понять что файл существует
    try {
        await promises.stat(path)
        return true
    } catch (e) {
        return false
    }
}

export {saveKeyValue, getKeyValue, TOKEN_DICTIONARY}

/*
import { homedir } from 'os'

Если этот saveKeyValue был у юзера то он его обновит, если нет то создаст

Библиотека OS
Как нам получить домашнюю директорию, для этого будем использовать os
В os которая идет уже по стандарту идет огромное число фций, который относятся к самой операционой системе, среди них есть hostname, homedir, архитектура, то-есть всё что мы можем получить об операционой системе

homedir() - это функция, которая возвращает строку домашней директории
Ruslan@MacBook-Pro first-project % node weather -t someValue
/Users/Ruslan
Мы получили домашнюю директорию на макос где распологается все файлы касаемо моего пользователя

import { join, basename, dirname, extname, relative, isAbsolute, resolve, sep } from 'path'
Библиотека path

join - фция, который из двух строк делает путь
Вот такая запись просто возьёт и сконкатинирует строки join(homedir(), 'weather-data.json'))
/Users/Ruslan/weather-data.json

join(homedir(), '../weather-data.json')
Мы получаем просто /Users/weather-data.json. По-этому если бы мы просто сделали одна строка +  другая мы бы не получили правильной работы с путями, потому что две точки означает что мы должны сделать шаг назад. По-этому мы говорим что бы обращаемся к нашей директории, делаем шаг назад и там уже будет распологаться weather-data.json
По-этому если мы работает с путями, то не в коем случаи их не плюсуем, не конкатинируем, а только с помощью библотеки path, потому что она за нас решит все эти сложности с шагами назад, вложеностями, различнымит форматами для различных операционых систем(потому что в одной операционой системе используется один слеш, в другой обратный слеш и тд)

Какие еще есть возможно у библиотеки path ?
basename - это имя которое находится в последним вложение. То что находится в самом конце. Если Users/Ruslan то получим Ruslan. Если Users/Ruslan/project то получим project. Если это папка то получим папку, если файл, то файл
console.log(basename(filePath))
Ruslan@MacBook-Pro first-project % node weather -t someValue
weather-data.json

dirname - то где у нас находится в указанной строке путь
/Users/Ruslan
Потому что наш везер.джсон const filePath = join(homedir(), 'weather-data.json') вложен в Ruslan

extname - вернет разрширение файла
.json
Будет полезно использовать вместо split по точке

relative
Рилейтим принимает два значения relative(filePath, dirname(filePath))
Мы получили ..
relative говорит нам какой путь нам нужен относительно одного и второго, то-есть что нам нужно сделать что бы прийди из from к to
То-есть что бы прийти из filePath(а именно /Users/Ruslan/weather-data.json) в dirname(filePath)(а именно Users/Ruslan) то нам нужно сделать один шан назад

isAbsolute
Представим что мы делаем cli которая принимает и абсолютный и относительный путь, то исАбсолют будет полезен
Он возвращает true если у нас путь абсолютный
И если путь относительный(то-есть с точкой, точка с точкой и так далее) то false
В нашем случае true - isAbsolute(filePath)

resolve
Позволяет посмотреть что будет если от текущего пути где у нас исполняется мы сделаем какие-то шаги, к примеру отнсительно текущего пути делаем шаг назад
resolve('..')
/Users/Ruslan/Desktop/Work/larichev-nodejs потому что я сейас в first-project

sep(Сепарат)
console.log(sep)
/
В нашей операционой системе это обычный слеш, то-есть наши файлы и папки будут отделятся друг от друга с помощью /
К примеру вместо того же сплита нужно сделать, если мы сделаем жестко по Слешу то в винде это уже не будет работать !


//
Библиотека fs
writeFileSync - синхронная фция, которая блокирует наш поток и в результате сохраняет файл
В данном случае мы её можем использовать, потому что паралельно ничего происходить не будет
Это фцией лучше не пользоваться нигде, только в CLIках

writeFile - работает на коллбеках. Первым параметром название файла, вторым - данные которые мы хотим сохранить и дальше идет коллбек. Этот коллбек нам позволяет среагировать на то, когда файл записан
Так как мы пишем на современном js и нам callback hell только будет мешать, то-есть:  () => {} и в ней еще будет вложенная фция
writeFile('nameOfFile', {}, {}, () => {})
то мы можем воспользоваться promises которая библиотека fs позволяет воспользоваться с недавнего времени !

promises - это методы которые позволяют получить информацию о нашей файловой системе, читать оттуда и записывать
promises. и тут будет куча фций: проверить доступ, добавить к файлу

await promises.writeFile(filePath, JSON.stringify(data))
Мы создаем Объект data, данные нам приходят из файла weather.js
Мы передаем в writeFile путь и так как мы не можем просто передать js объект, то передаем json
а await пишем потому что это Промисы

Но здесь возникает некоторая проблема
Мы записываем как бы один ключ и у нас может файла не быть, тогда всё хорошо и мы с помощью writeFile его сохраним
Но если у нас файл есть, то нам нужно его перезаписать
Но мы его перезапишем теоритечски одним значением, а у нас мог бы быть другой ключ, мы в файлах должны хранить не только текущее значение которые мы записали на текущий момент, но и то что мы записывали далее
То-есть нам нужно проверить или файл существует, и если он существует то сначала его выкачать, потом положить в исходную data, а затем добавить или модифицировать существующий ключ и заново записать
if (await isExist(filePath)) {
        const file = await promises.readFile(filePath)
}
Если файл существует то нам нужно его прочитать
Затем из строки сделать Объект data = JSON.parse(file) потому что там лежит JSON
И после того как всё прочитали нам нужно модифицировать ключ

Так как этот service посвещен тому что мы будем сохранять и читать файл, то здесь не должно быть никакой логики связанной с консольным выводом, что мы что-то будем выводить, что бы у нас было разделение отвественности. То-есть storage.services только что-то получает и сохраняет

promises.stat - stat возвращает статистику по нашему файлу, а если файла нет то он у нас падает
try {
        await promises.stat()
        return true
    } catch (e) {
        return false
    }
Если все хорошо то стат вернет тру, если не то фолс, потому что он падает мы по-этому его выносим в catch

Пишем для теста
node weather -t someToken

*/