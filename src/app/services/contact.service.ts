import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/contacts'; // adjust if needed

  constructor(private http: HttpClient) {}

  // GET all contacts
  getContactList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // GET single contact by id
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // ADD contact
  addContact(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // UPDATE contact
  updateContact(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // DELETE contact
  deleteContact(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
  