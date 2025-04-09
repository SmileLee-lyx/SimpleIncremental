export function get_bit(bits: number[], index: number): boolean {
    if (index < 0 || index >= bits.length * 8) return false;
    return (bits[Math.floor(index / 8)] & (1 << (index % 8))) !== 0;
}

export function set_bit(bits: number[], index: number, value: boolean) {
    if (index < 0) return;
    while (index >= bits.length * 8) {
        bits.push(0);
    }
    if (value) {
        bits[Math.floor(index / 8)] |= (1 << (index % 8));
    } else {
        bits[Math.floor(index / 8)] &= ~(1 << (index % 8));
    }
}