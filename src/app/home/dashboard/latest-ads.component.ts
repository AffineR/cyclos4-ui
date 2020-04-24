import { ChangeDetectionStrategy, Component, Injector, Input, OnInit } from '@angular/core';
import { AdAddressResultEnum, AdOrderByEnum, AdResult } from 'app/api/models';
import { MarketplaceService } from 'app/api/services';
import { BaseDashboardComponent } from 'app/home/dashboard/base-dashboard.component';
import { BehaviorSubject } from 'rxjs';
import { Menu, ActiveMenu } from 'app/shared/menu';
import { HeadingAction } from 'app/shared/action';

/**
 * Displays the latest advertisements
 */
@Component({
  selector: 'latest-ads',
  templateUrl: 'latest-ads.component.html',
  styleUrls: ['latest-ads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LatestAdsComponent extends BaseDashboardComponent implements OnInit {

  @Input() groups: string[];
  @Input() max: number;

  ads$ = new BehaviorSubject<AdResult[]>(null);

  constructor(injector: Injector,
    private marketplaceService: MarketplaceService) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.max) {
      this.max = 6;
    }

    // The heading actions
    this.headingActions = [
      new HeadingAction('search', this.i18n.general.view,
        event => this.menu.navigate({
          menu: new ActiveMenu(Menu.SEARCH_ADS),
          clear: false,
          event: event
        }),
        true)
    ];

    this.addSub(this.marketplaceService.searchAds({
      addressResult: AdAddressResultEnum.NONE,
      groups: this.groups,
      hasImages: true,
      profileFields: ['image:true'],
      orderBy: AdOrderByEnum.DATE,
      fields: ['id', 'owner', 'image', 'name'],
      pageSize: this.max,
      skipTotalCount: true
    }).subscribe(ads => {
      this.ads$.next(ads);
    }));
  }

  path(ad: AdResult): string {
    return `/marketplace/view/${ad.id}`;
  }

  navigate(ad: AdResult, event: MouseEvent) {
    this.menu.navigate({
      url: this.path(ad),
      menu: new ActiveMenu(Menu.SEARCH_ADS),
      clear: false,
      event: event
    });
  }

  navigateToOwner(ad: AdResult, event: MouseEvent) {
    this.menu.navigate({
      url: `/users/${ad.owner.id}/profile`,
      menu: new ActiveMenu(Menu.SEARCH_USERS),
      clear: false,
      event: event
    });
  }
}
