/* tslint:disable:no-unused-variable */

// import { TestBed, async } from '@angular/core/testing';
import { ComponentFixture, TestBed, async, inject, ComponentFixtureAutoDetect } from '@angular/core/testing';
import {} from 'jasmine';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';
import 'rxjs/add/operator/toPromise';

import { AppComponent } from '../components/main/main';
import { TimeFltersComponent } from '../components/filter/filter';
import { LoadData } from '../services/http.service';

let comp:    AppComponent;
let fixture: ComponentFixture<AppComponent>;
let de:      DebugElement;
let el:      HTMLElement;

describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, HttpModule],
            declarations: [
                AppComponent,
                TimeFltersComponent
            ], // declare the test component
            providers: [
                LoadData,
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });

        // create component and test fixture
        fixture = TestBed.createComponent(AppComponent);

        // get test component from the fixture
        comp = fixture.componentInstance;

        de = fixture.debugElement.query(By.css('b'));
        el = de.nativeElement;
    });

    it('Should send request and get data', () => {
        inject([LoadData], (loadData: LoadData) => {
            loadData.request().toPromise().then(data => {
                expect(data.days.length).toBeGreaterThan(0);
                expect(data.timeframeArray.length).toBeGreaterThan(0);
                expect(data.matrix.length).toBeGreaterThan(0);

                expect(comp.loading).toBe(false);
                expect(comp.days).toEqual(data.days);
                expect(comp.time).toEqual(data.timeframeArray);
                expect(comp.data).toEqual(data);
            })
        })
    })

    it('Create chart and calculate max cars and timeframe', () => {
        comp.buildChart(0);
        expect(comp.maxCars).toBeDefined();
    })
});
