import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IndexedDbService } from '../indexedDb.service';
import CryptoJS from 'crypto-js';

interface User{
  email : string,
  password : string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  message: string = '';
  
  constructor(
    private fb: FormBuilder,
    private dbService: IndexedDbService
  ){}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],         // Email is required and should match the email pattern
      'password': ['', [Validators.required, Validators.minLength(8)]],   // Password is required and should be at least 8 characters
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async login(){
    if (this.loginForm.invalid) {
      return;
    }
    const {email,password} = this.loginForm.value

    try{
      const userData = await this.dbService.getUserByEmail(email)
      if(!userData){
        this.message = 'Invalid email'
        return
      }
      const decryptedPassword = CryptoJS.AES.decrypt(userData.password, password).toString(CryptoJS.enc.Utf8)
      
      if(password !== decryptedPassword){
        this.message = 'Invalid password'
        return
      }

      localStorage.setItem('user',JSON.stringify(userData))
    }catch(err){
      this.message = `${err}`;
    }
  }
}
