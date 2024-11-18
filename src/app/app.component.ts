import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexedDbService } from './indexedDb.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers:[IndexedDbService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meeting-room-booking-application';
}
