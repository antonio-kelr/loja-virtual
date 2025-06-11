import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Endereco } from '../interfaces/endereco.interface';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private apiUrl = `${environment.apiUrl}/endereco`;

  constructor(private http: HttpClient) { }

  listarEnderecos(): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(this.apiUrl);
  }
}
