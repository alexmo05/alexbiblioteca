import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

scrollA(id: string) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


}


