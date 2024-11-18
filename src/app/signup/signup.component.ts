import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, UrlSegment } from '@angular/router';
import { IndexedDbService } from '../indexedDb.service';
import { CommonModule } from '@angular/common';
import CryptoJS from 'crypto-js';

interface User{
  name : string,
  email : string,
  password : string
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  signupForm!: FormGroup;
  message: string = '';
  
  constructor(
    private fb: FormBuilder,
    private dbService: IndexedDbService
  ){}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      'name': ['', [Validators.required, Validators.minLength(3)]],  // Username is required and should be at least 3 characters
      'email': ['', [Validators.required, Validators.email]],         // Email is required and should match the email pattern
      'password': ['', [Validators.required, Validators.minLength(8)]],   // Password is required and should be at least 8 characters
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  async signUp(){
    if (this.signupForm.invalid) {
      return;
    }
    const {name,email,password} = this.signupForm.value

    try{
      const emailExist = await this.dbService.getUserByEmail(email)
      console.log(emailExist);
      
      if(emailExist){
        this.message = 'Email already in use'
        return
      }

      const passwordHash = CryptoJS.AES.encrypt(password, password).toString()
      const newUser = {
        name : name,
        email : email,
        password : passwordHash
      }
      await this.dbService.addUser(newUser)
    }catch(err){
      this.message = `${err}`;
    }
  }
}
