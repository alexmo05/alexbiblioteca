import { Component, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  idiomaSeleccionado: string = '';

  libros: any[] = [];
  cargando: boolean = false;

  libroSeleccionado: any = null;
  chatAbierto: boolean = false;

  favoritos: any[] = [];

  private busqueda$ = new Subject<string>();
  private subscripcion!: Subscription;

  private startIndex = 0;
  private maxResults = 40;
  private totalItems = 0;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.subscripcion = this.busqueda$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(valor => {
        this.termino = valor;
        this.resetBusqueda();
        this.cargarTodosLibros();
      });

    // Carga inicial
    this.termino = '­­­­­­­­­';
    this.cargarTodosLibros();

    // Cargar favoritos desde localStorage (si estamos en navegador)
    if (this.isBrowser) {
      const fav = localStorage.getItem('favoritos');
      if (fav) {
        this.favoritos = JSON.parse(fav);
      }
    }
  }

  onInputChange(valor: string) {
    this.busqueda$.next(valor);
  }

  onCategoriaChange(categoria: string) {
    this.categoriaSeleccionada = categoria;
    this.resetBusqueda();
    this.cargarTodosLibros();
  }

  onIdiomaChange(idioma: string) {
    this.idiomaSeleccionado = idioma;
    this.resetBusqueda();
    this.cargarTodosLibros();
  }

  resetBusqueda() {
    this.libros = [];
    this.startIndex = 0;
    this.totalItems = 0;
  }

  cargarTodosLibros() {
    if (!this.termino.trim() && !this.categoriaSeleccionada && !this.idiomaSeleccionado) {
      this.termino = '­';
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

    let url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${start}&maxResults=${this.maxResults}`;

    if (this.idiomaSeleccionado) {
      url += `&langRestrict=${this.idiomaSeleccionado}`;
    }

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

  seleccionarLibro(libro: any): void {
  this.libroSeleccionado = libro;

  setTimeout(() => {
    const detalleEl = document.getElementById('detalles-libro');
    if (detalleEl) {
      detalleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}


  cerrarChat = () => {
    this.chatAbierto = false;
  };

  agregarAFavoritos(libro: any) {
    const yaExiste = this.favoritos.some(f => f.id === libro.id);
    if (!yaExiste) {
      this.favoritos.push(libro);
      if (this.isBrowser) {
        localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
      }
    }
  }

  eliminarFavorito(id: string) {
    this.favoritos = this.favoritos.filter(f => f.id !== id);
    if (this.isBrowser) {
      localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
    }
  }

 

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }
  subirArriba() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
scrollA(id: string) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
esFavorito(id: string): boolean {
  return this.favoritos.some(fav => fav.id === id);
}



}
