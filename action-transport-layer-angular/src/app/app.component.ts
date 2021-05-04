import { Component } from '@angular/core';
import {TransportService, IAction} from './transport.service';

class HelloAction implements IAction<{Error: Error, Result: string}> {
  type = 'hello';
  payload = null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  text$ = this.transport.on(HelloAction);

  constructor(private transport: TransportService) {
  }

  send() {
    const a = new HelloAction();
    this.transport.send(a.type, a.payload);
  }
}
