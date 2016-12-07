// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;
declare var Charts: any;
declare var Swiper: any;

export interface ServerResponse {
    days?: Array<string>;
    matrix?: Array<number>[];
    timeframeArray?: Array<string>;
}

export interface OutputEvent {
    start_value: string;
    end_value: string;
}
