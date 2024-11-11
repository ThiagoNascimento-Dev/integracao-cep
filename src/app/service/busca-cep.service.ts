import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICep } from '../interface/ICep.interface';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscaCepService {

  constructor(private http: HttpClient) { }

  buscarCep(cep: string):Observable<ICep> {
    return this.http.get<ICep>(environment.urlBase + cep + '/json/')
  }

}
