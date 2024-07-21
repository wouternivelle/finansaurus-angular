import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NGXLogger} from 'ngx-logger';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-dashboard-home',
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.scss'],
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatIcon,
    ],
})
export class DashboardHomeComponent implements OnInit {
  currentUser: any;

  constructor(
    private titleService: Title,
    private logger: NGXLogger
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Finansaurus - Dashboard');
    this.logger.log('Dashboard loaded');
  }
}
