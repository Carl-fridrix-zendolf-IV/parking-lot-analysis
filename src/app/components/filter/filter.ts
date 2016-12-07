import { Component, EventEmitter } from '@angular/core';


@Component({
    selector: 'time-intervals',
    inputs: ['timeframe'],
    outputs: ['changeTimeFrame'],
    templateUrl: './filter.html'
})
export class TimeFltersComponent {
    public timeframe: Array<string>;

    public startIntrvalsList: Array<string> = this.timeframe;
    public endIntrvalsList: Array<string> = this.timeframe;

    public selectedStartTime: string;
    public selectedEndTime: string;

    public changeTimeFrame: any = new EventEmitter();

    constructor () { }

    ngOnChanges () {
        if (this.timeframe) {
            this.selectedStartTime = this.timeframe[0];
            this.selectedEndTime = this.timeframe[this.timeframe.length - 1];

            this.changeTime();
        }
    }

    changeTime () :void {
        let start_index = this.timeframe.indexOf(this.selectedStartTime);
        let end_index = this.timeframe.indexOf(this.selectedEndTime);

        if (start_index > end_index) {
            return alert("Start time can't be more than end time!");
        }
        else if (end_index < start_index) {
            return alert("End time can't be less than start time!");
        }

        this.changeTimeFrame.next({start_value: this.selectedStartTime, end_value: this.selectedEndTime});
    }
}
