import { force_in_range } from "@/util/number-range.js";

class ColorSpec {
    r: number;
    g: number;
    b: number;

    constructor();
    constructor(r: number, g: number, b: number);
    constructor(props: { r: number, g: number, b: number });

    constructor() {
        const props = arguments[0];
        if (props === undefined || props === null) {
            this.r = this.g = this.b = 0;
            return;
        }
        if (typeof props === 'object') {
            this.r = props.r;
            this.g = props.g;
            this.b = props.b;
            return;
        }
        this.r = arguments[0];
        this.g = arguments[1];
        this.b = arguments[2];
    }

    to_css(): string {
        let r_value: any = force_in_range(Math.round(this.r), 0, 255);
        let g_value: any = force_in_range(Math.round(this.g), 0, 255);
        let b_value: any = force_in_range(Math.round(this.b), 0, 255);
        return `rgb(${ r_value }, ${ g_value }, ${ b_value })`;
    }

    static RED = new ColorSpec(255, 0, 0);
    static GREEN = new ColorSpec(0, 255, 0);
    static BLUE = new ColorSpec(0, 0, 255);
    static WHITE = new ColorSpec(255, 255, 255);
    static BLACK = new ColorSpec(0, 0, 0);
    static YELLOW = new ColorSpec(255, 255, 0);
    static CYAN = new ColorSpec(0, 255, 255);
    static PURPLE = new ColorSpec(255, 0, 255);
    static ORANGE = new ColorSpec(255, 128, 0);
}

function mix(start: ColorSpec, end: ColorSpec, progress: number): ColorSpec {
    return new ColorSpec(
        start.r * (1 - progress) + end.r * progress,
        start.g * (1 - progress) + end.g * progress,
        start.b * (1 - progress) + end.b * progress,
    );
}