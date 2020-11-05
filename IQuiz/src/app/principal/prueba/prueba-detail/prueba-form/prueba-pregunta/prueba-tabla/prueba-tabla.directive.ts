import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: '[appPruebaTabla]'
})
export class PruebaTablaDirective {
  @Input('appPruebaTabla') palabra: FormControl;
  cont = 0;

  constructor(private el: ElementRef) { }

  @HostListener('click', ["$event"]) onClick(event) {
    event.preventDefault();
    if(this.cont == 0) {
      this.palabra.setValue(this.styles('darkslateblue', 'white', true));
      this.cont++;
    } else {
      this.palabra.setValue(this.styles('white', 'black', false));
      this.cont--;
    }
  }

  styles(bg: string, color: string, hasText: boolean) {
    this.el.nativeElement.style.backgroundColor = bg;
    this.el.nativeElement.style.color = color;
    return hasText ? this.el.nativeElement.innerHTML : '';
  }
}
