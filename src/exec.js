// v1
const app = new MyClock();
const destruct = Framework.render(app, document.getElementById('root'));
setTimeout(destruct, 120000);
//SPLIT

// v2
// текущее время (количество секунд от точки отсчета времени)
const time = 1267457;

// параметры планет
const planets = [
    { h: 4, m: 20, s: 10 },
    { h: 12, m: 60, s: 60 }
];

const app = new MyClock({ planets, time });
const destruct = Framework.render(app, document.getElementById('root'));
setTimeout(destruct, 120000);
//SPLIT

// v3
const app = new MyClock();
const destruct = Framework.render(app, document.getElementById('root'));
setTimeout(destruct, 120000);

//SPLIT

// v4
// текущее время в текущей локации (количество секунд от 1 января 2270)
const time = 1267457;

// маршрут курьера — точки для телепортации
// offset - на сколько часовых поясов перемещаемся относительно предыдущей точки (+ или -)
// delay - длительность телепортации в секундах
const points = [
    { offset: 0.5, delay: 10 },
    { offset: 0.5, delay: 10 },
    { offset: 0.5, delay: 10 },
    { offset: 0.5, delay: 10 },
    { offset: -6, delay: 10 }
];

const app = new MyClock({ points, time });
const destruct = Framework.render(app, document.getElementById('root'));
setTimeout(destruct, 120000);
//SPLIT

const runTest = (test = {}) => {
    const { steps = [], params = {} } = test;

    const app = new MyClock(params);
    const ticker = new FakeTicker();

    const destruct = Framework.render(app, document.getElementById('root'), ticker);
    const result = [];

    steps.forEach(item => {
        item.button !== undefined && (app.buttons[item.button].onPress());
        
        item.ticks !== undefined && (ticker.tick(item.ticks));
        
        let state = app.arrows.reduce((prev, a) => {
            prev[a.id] = a.pos;
            return prev;
        }, {});
        result.push(state);
    })

    destruct();

    return result;
}

