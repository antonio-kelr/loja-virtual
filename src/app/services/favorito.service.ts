import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {
  private apiUrl = 'http://localhost:5299/api/favorito';

  constructor(private http: HttpClient) { }

  getFavoritos(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl, { headers });
  }
}
