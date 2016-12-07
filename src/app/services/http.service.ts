import {Injectable} from '@angular/core';
import {Http, Jsonp, Response, RequestOptions, URLSearchParams} from '@angular/http';

import { Observable }     from 'rxjs/Observable';

import {Config} from '../index';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class LoadData {
    constructor (public http?: Http, private jsonp?: Jsonp) {}

    request () {
        let params: URLSearchParams = new URLSearchParams();

        // params.set('items', '6');
        // params.set('days', '60');
        params.set('callback', 'JSONP_CALLBACK');

        var options = new RequestOptions({
            search: params
        });

        return this.jsonp.get(Config.URL, options)
            .map((res: Response) => {
                let data = res.json();

                let minutesPerDay = 60 * 24; // get minutes in one day
                let step = minutesPerDay / 30; // create time step.
                let counter = 0;

                let timeframeArray = new Array(step); // create timeframe array with lenght 48. X axis in a chart
                timeframeArray.fill(0);

                let days = new Array(); // list of available days;
                let matrix = new Array();

                // Generate X axis with hours and minutes
                timeframeArray.forEach((item, i) => {
                    // if this is odd number
                    if (!(i % 2)) {
                        return timeframeArray[i] = counter.toString() + ':00';
                    }
                    // if this is even number
                    else if (i % 2) {
                        timeframeArray[i] = counter.toString() + ':30';
                        counter++;
                        return;
                    }
                })

                // Sort data by arrive time
                data.sort((a,b) => {
                    if (new Date(a.ArrivalTime).getTime() > new Date(b.ArrivalTime).getTime()) {
                        return 1;
                    }
                    else if (new Date(a.ArrivalTime).getTime() < new Date(b.ArrivalTime).getTime()) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                })

                // Algorithm
                var dataLength = data.length;
                for (var z = 0; z < dataLength; z++) {
                    let item = data[z];

                    let arriveDate = item.ArrivalTime.split('T')[0];
                    let leaveDate = item.LeaveTime.split('T')[0];

                    // Update dates array.
                    // If dates array haven't this date, add them
                    if (days.indexOf(arriveDate) == -1) {
                        days.push(arriveDate);
                        matrix.push(new Array(step).fill(0));
                    }

                    // If dates array haven't this date, add them
                    if (days.indexOf(leaveDate) == -1) {
                        days.push(leaveDate);
                        matrix.push(new Array(step).fill(0));
                    }

                    let arriveIndex = days.indexOf(arriveDate);
                    let leaveIndex = days.indexOf(leaveDate);

                    // Find a time then car arrive/leave
                    let getSearchTime = (time) :string => {
                        let searchHour = (new Date(time).getUTCHours()).toString();
                        let searchMinutes = (new Date(time).getMinutes() < 30) ? '00' : '30';

                        return searchHour + ':' + searchMinutes;
                    }

                    let startTime = getSearchTime(item.ArrivalTime);
                    let endTime = getSearchTime(item.LeaveTime);

                    let startIndex = timeframeArray.indexOf(startTime);
                    let endIndex = timeframeArray.indexOf(endTime);

                    let difference = endIndex - startIndex;

                    // If car arrive and leave parking during the one day
                    if (arriveDate == leaveDate) {
                        for(let i = 0; i < difference; i++) {
                            matrix[arriveIndex][startIndex] += 1;
                            startIndex++;
                        }
                    }
                    // If car arrive in one day and leave parking in another day
                    else {
                        // For loop of first parking day array
                        let firstArrayLength = matrix[arriveIndex].length - startIndex;
                        for (let a = 0; a < firstArrayLength; a++) {
                            matrix[arriveIndex][startIndex] += 1;
                            startIndex++;
                        }

                        // For loop of second parking day array
                        let secondArrayLength = matrix[leaveIndex].length;
                        let counter = 0;
                        for (let b = 0; b < secondArrayLength; b++) {
                            if (b == endIndex)
                                break;

                            matrix[leaveIndex][counter] += 1;
                            counter++;
                        }
                    }
                }

                let response = {
                    days: days,
                    timeframeArray: timeframeArray,
                    matrix: matrix
                }

                return response;
            }, (err) => {
                console.log(err);
            })
    }
}
