import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private data = new BehaviorSubject<string>('Principal');
  data$ = this.data.asObservable();

  constructor() { }

  changeTitle(data: string) {
    this.data.next(data)
  }
}
