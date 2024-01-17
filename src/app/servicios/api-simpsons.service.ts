import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiSimpsonsService {
  constructor(private http: HttpClient) {}

  async getPaises() {
    try {
      const response: any = await fetch('https://apisimpsons.fly.dev/api/personajes?limit=400&page=1');
      const paises: any = await response.json();
      return paises;
    } catch (error) {
      console.log(error);
    }
  }
}
