import { ServerResponse } from '../typings.d';

export * from './components/main/main';
export * from './app.module';

export class Config {
    public static URL: string = 'http://parkingapi.gear.host/v1/parking';
}
