import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SharedService } from '@shared_service/*';
import { AuthService } from '@auth_service/*';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit, OnDestroy {
  title: string;
  mobileQuery: MediaQueryList;

  constructor(
    public service: AuthService, 
    sharedService: SharedService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher
  ) {
    sharedService.data$.subscribe(title => this.title = title);
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;
}
