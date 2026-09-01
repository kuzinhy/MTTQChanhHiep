export function getApiUrl(path: string): string {
  const host = window.location.hostname;
  const isCloudRun = host.endsWith('.run.app') || host.endsWith('.aistudio.google');
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.');

  // If we are not on Cloud Run and not on Localhost, we are probably deployed on Vercel or a custom domain.
  // Direct the API requests to the official backend container running on Cloud Run.
  if (!isCloudRun && !isLocalhost) {
    const baseUrl = 'https://ais-pre-eokzuo3lbp4ijcdgdnvif3-553565080913.asia-southeast1.run.app';
    const sanitizedPath = path.startsWith('/') ? path : '/' + path;
    return `${baseUrl}${sanitizedPath}`;
  }
  return path;
}
