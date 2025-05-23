import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-ia.component.html',
  styleUrls: ['./chat-ia.component.css']
})
export class ChatIaComponent {
  @Input() libro: any;
  @Input() visible: boolean = false;
  @Input() cerrarCallback!: () => void;

  mensajeUsuario: string = '';
  mensajes: { user: string; ia: string }[] = [];

  constructor(private http: HttpClient) {}

  cerrar() {
    this.cerrarCallback();
  }

  enviar() {
    if (!this.mensajeUsuario.trim()) return;

    const pregunta = this.mensajeUsuario;
    this.mensajes.push({ user: pregunta, ia: 'Pensando...' });

    const body = {
      message: pregunta,
      chat_history: [
        {
          user_name: 'usuario',
          user_input: `Hablemos del libro "${this.libro?.volumeInfo?.title}"`,
          response: 'Claro, dime qué quieres saber.'
        }
      ],
      model: 'command-r'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Gj1uIBrs3UDsDJDyF3dNKF8ALxmQANOoyssEdTjL' 
    });

    this.http.post<any>('https://api.cohere.ai/v1/chat', body, { headers }).subscribe({
      next: (res) => {
        const respuesta = res.text ?? 'No hay respuesta';
        this.mensajes[this.mensajes.length - 1].ia = respuesta;
        this.mensajeUsuario = '';
      },
      error: (err) => {
        console.error('Error con Cohere:', err);
        this.mensajes[this.mensajes.length - 1].ia = 'Error al contactar con la IA.';
      }
    });
  }
}
