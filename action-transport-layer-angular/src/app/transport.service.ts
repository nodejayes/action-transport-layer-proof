import {EventEmitter, Injectable} from '@angular/core';
import {Client} from 'action-transport-layer-javascript-client';
import {Subject} from 'rxjs';

export interface IAction<T> {
  type: string;
  payload: T;
}

@Injectable({providedIn: 'root'})
export class TransportService {
  private client: Client = null;
  private listeners: {[key: string]: Subject<any>} = {}
  public onAction = new EventEmitter<any>();
  public onError = new EventEmitter<Error>();

  public init(url: string) {
    this.client = new Client(url);
    this.client.onMessage(a => this.onAction.emit(a));
    this.client.onError(err => this.onError.emit(err));
  }

  public on<T>(action: new () => IAction<T>): Subject<T> {
    const act = new action();
    if (this.listeners[act.type]) {
      return this.listeners[act.type];
    }

    const s = new Subject<T>();
    this.onAction.subscribe(a => {
      if (act.type !== a.type) {
        return;
      }
      s.next(a.payload);
    });
    this.listeners[act.type] = s;
    return this.listeners[act.type];
  }

  public async connect(): Promise<void> {
    if (!this.client) {
      return;
    }
    await this.client.connect();
  }

  public disconnect(): void {
    if (!this.client) {
      return;
    }
    this.client.disconnect();
    this.client = null;
  }

  public send<T>(type: string, payload: T): void {
    this.client.send(type, payload);
  }
}
