import { TestBed } from '@angular/core/testing';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { ProductRedirectGuard } from './product-redirect.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductRedirectGuard', () => {
  let guard: ProductRedirectGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [ProductRedirectGuard],
    });
    guard = TestBed.inject(ProductRedirectGuard);
    router = TestBed.inject(Router);
  });

  function makeState(url: string): RouterStateSnapshot {
    // minimal stub
    return { url } as RouterStateSnapshot;
  }

  it('should allow root and product paths', () => {
    expect(
      guard.canActivate({} as ActivatedRouteSnapshot, makeState('/')),
    ).toBeTrue();
    expect(
      guard.canActivate(
        {} as ActivatedRouteSnapshot,
        makeState('/product/foo'),
      ),
    ).toBeTrue();
  });

  it('should redirect legacy path when mapping exists', () => {
    spyOn(router, 'navigateByUrl');
    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      makeState('/old-page'),
    );
    expect(result).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/product/new-slug');
  });

  it('should not redirect unknown path', () => {
    spyOn(router, 'navigateByUrl');
    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      makeState('/some/random'),
    );
    expect(result).toBeTrue();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should automatically prefix single‑segment legacy slugs', () => {
    spyOn(router, 'navigateByUrl');
    const result = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      makeState('/himalaya-liv-52-tab-1-unit'),
    );
    expect(result).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      '/product/himalaya-liv-52-tab-1-unit',
    );
  });
});
