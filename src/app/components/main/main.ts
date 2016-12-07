
import { Component, ViewChild, ElementRef } from '@angular/core';
import { LoadData } from '../../services/http.service';

import { Config } from '../../index';
import { ServerResponse, OutputEvent } from '../../../typings.d';
import { TimeFltersComponent } from '../filter/filter';


@Component({
    selector: 'app-root',
    templateUrl: './main.html'
})
export class AppComponent {
    @ViewChild('chart') chart: ElementRef;

    public data: ServerResponse;
    private data_cache: string;
    public days: Array<string>;

    public time: Array<string>;

    public selectedDay: string;
    public chartObject: any;
    public maxCars: number;
    public timeFrames: string;

    public loading: boolean;
    public error: boolean;

    public mobile: boolean; // handle mobile or desktop

    constructor (private loadData: LoadData) {
        this.mobile = (window.innerWidth <= 600) ? true : false;
    }

    ngOnInit () {
        this.error = false;
        this.loading = true;

        this.loadData.request().subscribe((data: ServerResponse) => {
            this.loading = false;

            // Set available days
            this.days = data.days;
            this.selectedDay = data.days[0];

            // @Input time
            this.time = data.timeframeArray;

            // General data
            this.data = data;
            this.data_cache = JSON.stringify(data); // save as string, because if save as object, this property change together with this.data changes

            // Build Chart
            this.buildChart(0);
        }, () => {
            this.loading = false;
            this.error = true;
        })
    }

    buildChart (index: number) {

        // Destroy old chart initialization if the was defined before
        if (this.chartObject)
            this.chartObject.destroy();

        this.calculateValues();
        this.chartObject = new Chart(this.chart.nativeElement, {
            type: 'line',
            data: {
                labels: this.data.timeframeArray,
                datasets: [
                    {
                        data: this.data.matrix[index],
                        backgroundColor: "rgba(255,235,59,0.65)",
                        borderColor: '#FFEB3B'
                    }
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: false
                }
            }
        })
    }

    calculateValues () {
        let index = this.days.indexOf(this.selectedDay);
        let framesList = new Array();
        this.maxCars = Math.max.apply(null, this.data.matrix[index]);

        for(let i = 0; i < this.data.matrix[index].length; i++) {
            let item = this.data.matrix[index][i];
            if (item == this.maxCars) {
                framesList.push(this.data.timeframeArray[i]);
            }
        }

        this.timeFrames = framesList.join(', ')
    }

    changeDay () {
        let cache = JSON.parse(this.data_cache);
        let index = this.days.indexOf(this.selectedDay);

        this.data = Object.assign({}, cache); // update data to default values;
        this.buildChart(index);
    }

    handleTimeFrameChange (arg: OutputEvent) {
        let cache = JSON.parse(this.data_cache);
        let index = this.days.indexOf(this.selectedDay);
        let interval = {
            start: cache.timeframeArray.indexOf(arg.start_value),
            end: cache.timeframeArray.indexOf(arg.end_value)
        }

        this.data.timeframeArray = cache.timeframeArray.slice(interval.start, interval.end + 1);
        this.data.matrix[index] = cache.matrix[index].slice(interval.start, interval.end + 1);

        this.buildChart(index);
    }

    showAllIntervals () {
        let cache = JSON.parse(this.data_cache);
        let index = this.days.indexOf(this.selectedDay);

        this.time = cache.timeframeArray.slice();
        this.data.matrix = cache.matrix;

        this.buildChart(index);
    }
}
