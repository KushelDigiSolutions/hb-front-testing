import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

export const bulkSuccessGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state
) => {
  const router = inject(Router);

  const refId = route.queryParamMap.get('refId');

  if (refId) {
    return true; // ✅ allow
  }

  return router.parseUrl('/herbs'); // or '/home'
};
