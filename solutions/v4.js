const ONE_SECOND_DEGREES = 6;
const ONE_SECOND_FACTOR = 1 / Framework.SPEED * ONE_SECOND_DEGREES;

class MyClock extends Framework.Clock {
    constructor() {
        super();

        this.arrows.push(new Framework.Arrow("seconds", {
            color: "red"
        }));

        this.arrows.push(new Framework.Arrow("minutes", {
            weight: 3,
            length: 80
        }));

        this.arrows.push(new Framework.Arrow("hours", {
            weight: 3,
            length: 60
        }));

        this.buttons.push(new Framework.Button("Next location", () => {
            alert("next");
        }));

        this.tick = 0;
    }

    onBeforeTick() {
        const [arrow] = this.arrows;

        this.tick++;

        arrow.rotateFactor = this.tick % 10 ? 0 : ONE_SECOND_FACTOR;

        console.log("before: " + arrow.pos);
    }

    onAfterTick() {
        const [arrow] = this.arrows;

        console.log("after: " + arrow.pos);
    }
}
