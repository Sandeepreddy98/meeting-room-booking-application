import { Injectable } from '@angular/core';

interface User {
  name : string,
  email : string
}
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  user: User = {name : '',email : ''};
  constructor(){
  }

  getUserData(){
    const {email,name} = JSON.parse(localStorage.getItem('user') as string)
    this.user['email'] = email
    this.user['name'] = name
  }
}
