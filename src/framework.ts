class Arrow {
    readonly id: string;

    rotateFactor: number;
    weight: number;
    length: number;
    color: string;

    _getPos?: () => number;

    constructor(id: string, { length = 90, weight = 1, color = '#000' }) {
        if (!(typeof id === 'string') || !id) { throw new Error(`invalir arrow id: ${id}`)};

        this.id = id;
        this.rotateFactor = 0;
        this.weight = weight;
        this.length = length;
        this.color = color;
    }

    get pos(): number | undefined {
        return this._getPos ? (this._getPos()  % 360 + 360) % 360 : undefined;
    }
}

class Button {
    text: string;
    onPress: () => void;

    constructor(text: string, onPress: () => void) {
        this.text = text;
        this.onPress = onPress;
    }
}

function addElement(className: string, container: HTMLElement): HTMLElement {
    const el = document.createElement('div');
    el.className = className;
    container.appendChild(el);

    return el;
}

abstract class Clock {
    public readonly arrows: Arrow[] = [];
    public readonly buttons: Button[] = [];

    onBeforeTick() {

    }

    onAfterTick() {

    }
}

class Ticker {
    start(onAfterTick: () => void): number {
        return setInterval(onAfterTick, INTERVAL);
    }

    stop(timerId: number) {
        clearInterval(timerId);
    }
}

// tick spacing
const INTERVAL = 100;

// arrow rotation speed when rotateFactor is 1 (degrees per tick)
const SPEED = 30;

// maximum arrow speed
const MAX_SPEED = 115;

const render = (clock: Clock, container: HTMLElement, ticker?: Ticker) => {
    const body = addElement('clock', container);
    const t = ticker || new Ticker();

    const arrows = clock.arrows.map(props => {
        const el = addElement('arrow', body);
        el.style.transition = `transform ${INTERVAL}ms linear`;
        el.style.height = `${props.weight}px`;
        el.style.width = `${props.length}px`;
        el.style.backgroundColor = props.color;

        const arrowData = { el, props, pos: 0 };
        props._getPos = () => arrowData.pos;

        return arrowData;
    });

    clock.buttons.forEach(b => {
        const el = addElement('button', container);
        el.innerText = b.text;
        el.onclick = b.onPress;
    });

    const onAfterTick = () => {
        clock.onBeforeTick();

        arrows.forEach(arrow => {
            const distance = SPEED * arrow.props.rotateFactor;

            if (Math.abs(distance) > Math.abs(MAX_SPEED)) throw new Error('maximum permissible speed exceeded');

            const newPos = arrow.pos + distance;
            arrow.pos = newPos;
            arrow.el.style.transform = `rotate(${newPos - 90}deg)`;
        });

        clock.onAfterTick();
    };

    const timerId = t.start(onAfterTick);

    return () => { t.stop(timerId); };
}

const Framework = {
    INTERVAL,
    SPEED,
    MAX_SPEED,

    Arrow,
    Button,
    Clock,
    Ticker,

    render
};

Object.freeze(Framework);
//SPLIT
class FakeTicker extends Ticker {
    private onAfterTick?: () => void;

    start(onAfterTick: () => void):number {
        this.onAfterTick = onAfterTick;
        return 0;
    }

    stop(timerId: number) {
        
    }

    tick = (count: number) => {
        console.time();
        for (let i = 0; i < count; i++) {
            this.onAfterTick && this.onAfterTick();
        }

        console.timeEnd();
    }
}
