export class Candle {
    constructor(
        readonly timestampMs: number,
        readonly open: string,
        readonly high: string,
        readonly low: string,
        readonly close: string,
        readonly volume: string,
        readonly count?: number,
        readonly closed?: boolean,
        readonly period?: string
    ) {}
}
