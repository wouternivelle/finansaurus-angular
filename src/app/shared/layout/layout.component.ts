import {MediaMatcher} from '@angular/cdk/layout';
import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy} from '@angular/core';
import {AuthenticationService} from "../../core/services/authentication/authentication.service";
import packageJson from '../../../../package.json';
import { MatNavList, MatListItem, MatListItemIcon, MatListItemTitle } from '@angular/material/list';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/divider';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton, MatFabButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: true,
    imports: [
        MatToolbar,
        MatIconButton,
        MatIcon,
        MatTooltip,
        RouterLink,
        MatButton,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem,
        MatDivider,
        MatSidenavContainer,
        MatSidenav,
        MatNavList,
        MatListItem,
        RouterLinkActive,
        MatListItemIcon,
        MatListItemTitle,
        MatSidenavContent,
        RouterOutlet,
        MatFabButton,
    ],
})
export class LayoutComponent implements OnDestroy, AfterViewInit {
  private readonly _mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;
  version = packageJson.version;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private authenticationService: AuthenticationService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  logout(): void {
    this.authenticationService.logout();
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
