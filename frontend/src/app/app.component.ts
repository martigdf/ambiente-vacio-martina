import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'remediacion';
}
