import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnDestroy {
  termino: string = '';
  categoriaSeleccionada: string = '';
  libros: any[] = [];
  cargando: boolean = false;

  libroSeleccionado: any = null;
  chatAbierto: boolean = false;

  private busqueda$ = new Subject<string>();
  private subscripcion!: Subscription;

  private startIndex = 0;
  private maxResults = 40;
  private totalItems = 0;

  constructor(private http: HttpClient) {
    this.subscripcion = this.busqueda$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(valor => {
        this.termino = valor;
        this.resetBusqueda();
        this.cargarTodosLibros();
      });
  }

  onInputChange(valor: string) {
    this.busqueda$.next(valor);
  }

  onCategoriaChange(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.resetBusqueda();
    this.cargarTodosLibros();
  }

  resetBusqueda() {
    this.libros = [];
    this.startIndex = 0;
    this.totalItems = 0;
  }

  cargarTodosLibros() {
    if (!this.termino.trim() && !this.categoriaSeleccionada) {
      this.libros = [];
      return;
    }

    this.cargando = true;
    this.cargarPagina(this.startIndex);
  }

  cargarPagina(start: number) {
    let query = '';

    if (this.termino.trim()) {
      query += encodeURIComponent(this.termino.trim());
    }

    if (this.categoriaSeleccionada) {
      query += `+subject:${encodeURIComponent(this.categoriaSeleccionada)}`;
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${start}&maxResults=${this.maxResults}`;

    this.http.get<any>(url).subscribe({
      next: res => {
        this.totalItems = res.totalItems || 0;
        const items = res?.items ?? [];

        this.libros.push(...items);
        this.startIndex += this.maxResults;

        if (this.startIndex < this.totalItems) {
          this.cargarPagina(this.startIndex);
        } else {
          this.cargando = false;
        }
      },
      error: err => {
        console.error('Error al buscar libros:', err);
        this.cargando = false;
      }
    });
  }

  abrirChat(libro: any) {
    this.libroSeleccionado = libro;
    this.chatAbierto = true;
  }

  cerrarChat = () => {
    this.chatAbierto = false;
  };

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }
}
