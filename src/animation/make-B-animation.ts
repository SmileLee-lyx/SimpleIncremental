let _animation: (() => void) | null = null;

export function set_make_B_animation(animation: () => void) {
    _animation = animation;
}

export function clear_make_B_animation() {
    _animation = null;
}

export function start_make_B_animation() {
    if (_animation !== null) {
        _animation();
    } else {
        console.error('animation is not implemented');
    }
}