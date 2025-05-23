import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { ChatIaComponent } from './components/chat-ia/chat-ia.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,HeaderComponent, BuscadorComponent,ChatIaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'alexbiblioteca';
}
