type OS = 'Windows Phone' | 'Android' | 'iOS' | 'Windows' | 'Linux' | 'MacOS' | 'unknown';

export const getOS = (_userAgent?: string): OS => {
  const userAgent = _userAgent || navigator?.userAgent || navigator?.vendor || (window as any)['opera'];

  // Check for Windows Phone first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  // Mobile operating systems
  if (/android/i.test(userAgent)) {
    //// Detect Android Mobile (contains 'Mobile' in user agent)
    // if (/mobile/i.test(userAgent)) {
    //   return 'Android Mobile';
    // }
    //// Detect Android Tablet (does not contain 'Mobile' in user agent)
    // return 'Android Tablet';

    return 'Android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any)['MSStream']) {
    return 'iOS';
  }

  // Desktop operating systems
  if (/windows nt/i.test(userAgent)) {
    return 'Windows';
  }

  if (/linux/i.test(userAgent)) {
    return 'Linux';
  }

  if (/macintosh|mac os x/i.test(userAgent)) {
    return 'MacOS';
  }

  return 'unknown';
};
