import {Component} from 'angular2/core';

@Component({
    selector: 'app',
    template: `
      <main>
        <h1>Hello from {{greeting}}</h1>
      </main>
    `
})
export class AppComponent {
  greeting: string,
  constructor() {
    this.greeting = 'webpack-ng-tw-babel-starter'
  }
}
