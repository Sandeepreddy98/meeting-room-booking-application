import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexedDbService } from './indexedDb.service';
import { UserServiceService } from './user-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers:[IndexedDbService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'meeting-room-booking-application';
  constructor(private userService : UserServiceService){

  }
  ngOnInit(): void {
    this.userService.getUserData()
    console.log(this.userService.user);
    
  }
}
