import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {
  private favoritosSubject = new BehaviorSubject<any[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();
  private apiUrl = 'http://localhost:5299/api/favorito';

  constructor(private http: HttpClient) { }

  getFavoritos(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl, { headers }).pipe(
      tap(response => {
        // Atualiza os favoritos quando buscar do servidor
        if (response && Array.isArray(response)) {
          this.favoritosSubject.next(response);
        }
      })
    );
  }

  postFavorito(produtoId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const body = { produtoId };

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      tap(() => {
        // Recarrega os favoritos após adicionar
        this.getFavoritos().subscribe();
      })
    );
  }

  deletetFavorito(produtoId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Removendo favorito. Token:', token, 'ProdutoId:', produtoId);
    // Aqui, só passa o headers, sem body
    return this.http.delete(`${this.apiUrl}/${produtoId}`, { headers }).pipe(
      tap(() => {
        // Recarrega os favoritos após remover
        this.getFavoritos().subscribe();
      })
    );
  }

  atualizarFavoritos(favoritos: any[]): void {
    this.favoritosSubject.next(favoritos);
  }

  getQuantidadeFavoritos(): Observable<number> {
    return new Observable(observer => {
      this.favoritos$.subscribe(favoritos => {
        observer.next(favoritos.length);
      });
    });
  }
}
