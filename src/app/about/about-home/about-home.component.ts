import {Component} from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-about-home',
    templateUrl: './about-home.component.html',
    styleUrls: ['./about-home.component.scss'],
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
    ]
})
export class AboutHomeComponent {
}
