import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  createToDo(obj: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/create`, obj);
  }

  public getAll(): Observable<any> {
    return this.http.get<any>(API_URL+"/getAll");
  }

  closeToDo(id: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/closeToDo/${id}`,{});
  }

}
