const getArgs = (args) => {
    const res = {}
    const [executor, file, ...rest] = args
    rest.forEach((value, index, array) => {
        // дошли до последнего элемента с дефисом
        if (value.charAt(0) === '-' && index === array.length - 1) {
            res[value.substring(1)] = true
        } else if (value.charAt(0) === '-' && array[index+1].charAt(0) !== '-') {
            res[value.substring(1)] = array[index + 1]
        } else if (value.charAt(0) === '-') {
            res[value.substring(1)] = true
        }
    })
    return res
}

export { getArgs }
/*
Что должна делать функция getArgs ?
[
  '/Users/Ruslan/.nvm/versions/node/v16.17.0/bin/node',
  '/Users/Ruslan/Desktop/Work/larichev-nodejs/first-project/weather.js',
  '2nd',
  '3rd'
]
Нам нужно откинуть первые два аргумента
И если есть что-то со слешом, то добавить например в Объект
То-есть фция проходится по этим аргументам и возвращает в этом args Объект вот здесь const args = getArgs(process.argv)
Который содержит значениями те аргументы, которые у нас переданы
К примеру если мы передали -s, а вторым moscow то мы должны получить const args.s который будет равен значению moscow
Если передали h, то args.h будет равен true

const [executor, file, ...rest] = args мы берем из этого массива первые два аргумнета и называем их executor, file, а все остальное кладем в rest - массив без первых двух аргументов

res[value.substring(1)] - ключ в Объекте res

Если нам нужно что бы из множества условий if нашолся нужный нам иф и после его исполнения сразу же произошел конец и ретерн с фции то нужно перед if писать else ! */