import { CandlePeriod } from ".";

export type Market = {
    id: string;
    base: string;
    quote: string;
    type?: string;
    candlePeriod?: CandlePeriod;
};
