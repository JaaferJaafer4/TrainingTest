import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyServiceService {

  apiUrl : string = "https://picsum.photos/"
  constructor(private http:HttpClient) { }

   getInfoById(id : number){
    return this.http.get<any>(this.apiUrl +"id/"+id+"/info");
  }

  generateRandomText(): string {
    const words = [
      'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
      'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua.'
    ];

    const numWords = Math.floor(Math.random() * 50) + 5; 
    let text = '';

    for (let i = 0; i < numWords; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      text += words[randomIndex] + ' ';
    }

    return text.trim();
  }
}
