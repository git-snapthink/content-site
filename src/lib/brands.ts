export interface BrandTheme {
  name: string
  displayFont: string
  googleFont?: string
  bg: string
  surface: string
  border: string
  text: string
  textMuted: string
  textFaint: string
  accent: string
  accentText: string
  logoHtml?: string
  faviconPath?: string
}

const brands: Record<string, BrandTheme> = {
  'nextbuild': {
    name: 'NextBuild',
    displayFont: 'Audiowide',
    googleFont: 'Audiowide',
    bg: '#f5f5f5',
    surface: '#ffffff',
    border: '#e8e8e8',
    text: '#1a1a1a',
    textMuted: '#777777',
    textFaint: '#aaaaaa',
    accent: '#ff6b35',
    accentText: '#ffffff',
    faviconPath: '/favicon.svg',
    logoHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 175 176"><path fill="#ff6b35" transform="scale(0.69392)" d="M125.882 30.2033C128.699 31.4207 133.053 34.0651 135.825 35.669L155.677 47.3445L187.177 65.6662C190.941 67.8461 201.678 73.7659 204.571 76.2186C205.211 77.8272 204.967 94.7161 204.973 97.7343L204.993 136.381L204.982 155.961C204.979 159.435 205.129 164.531 204.709 167.806C204.164 168.432 202.305 169.55 201.515 170.024C183.514 180.632 165.453 191.139 147.334 201.544L134.111 209.252C132.357 210.277 127.533 213.264 125.927 213.712C122.062 212.103 114.708 207.423 110.833 205.149C101.827 199.983 92.8637 194.745 83.9437 189.433L59.7382 175.325C55.7875 173.03 50.7372 170.344 47.0977 167.853C46.7941 163.492 47.0124 156.047 47.0109 151.5L47.1684 115.561L47.1684 90.0732C47.1496 86.2426 46.844 79.8688 47.193 76.2868C47.7583 75.2311 87.9315 52.1627 93.5083 48.8831L114.674 36.519C118.189 34.4904 122.316 31.9324 125.882 30.2033ZM74.2153 91.5134L74.2523 131.782C74.253 137.788 74.5042 146.423 74.1897 152.291C78.3961 154.469 83.3866 157.534 87.5661 159.965L112.403 174.509C116.593 176.97 121.825 180.2 126.102 182.349C136.827 176.203 147.517 169.998 158.172 163.733C164.611 159.985 171.514 156.121 177.822 152.196C177.693 145.665 177.677 138.985 177.747 132.452C177.89 118.932 177.494 105.29 177.795 91.7834C174.502 89.9987 170.87 87.6245 167.529 85.6925C156.896 79.5426 146.292 73.2591 135.671 67.0935C134.868 66.6273 126.12 61.5154 126.072 61.4981C114.506 67.9004 102.942 75.0868 91.4328 81.6393C86.9754 84.1771 78.5 89.6548 74.2153 91.5134Z"/><defs><linearGradient id="gLogo" gradientUnits="userSpaceOnUse" x1="116.8" y1="82.06" x2="155" y2="149.76"><stop offset="0" stop-color="#ff9055"/><stop offset="1" stop-color="#ffb888"/></linearGradient></defs><path fill="url(#gLogo)" transform="scale(0.69392)" d="M125.12 76.9814C126.274 76.836 127.14 77.2401 128.132 77.7918C134.267 81.2021 140.345 84.9031 146.418 88.4139L157.527 94.8201C159.495 95.9573 162.799 97.7559 164.433 99.1311C164.705 99.9917 164.854 101.317 164.849 102.24C164.778 114.37 164.768 126.499 164.884 138.63C164.901 140.438 164.935 142.296 164.569 144.073C162.522 146.347 131.713 163.62 127.122 166.217C126.809 166.468 126.978 166.361 126.455 166.376C125.706 165.021 125.863 125.326 126.265 121.555C124.032 120.598 111.755 113.377 109.554 112.048C106.293 110.079 89.8654 100.973 87.896 98.9518C91.1875 96.5948 98.3762 92.6578 102.097 90.497L125.12 76.9814Z"/></svg><span style="font-family:Audiowide,sans-serif;font-size:20px;line-height:1.15"><span style="color:#26201c;font-weight:400">Next</span><span style="color:#ff6b35;font-weight:600">Build</span></span>`,
  },
  'jason-c-lewis': {
    name: 'Jason C. Lewis',
    displayFont: 'Orbitron',
    googleFont: 'Orbitron',
    bg: '#ffffff',
    surface: '#f9fafb',
    border: '#e5e7eb',
    text: '#1a1a1a',
    textMuted: '#555555',
    textFaint: '#999999',
    accent: '#c1d42f',
    accentText: '#1a1a1a',
    faviconPath: '/favicon-jcl.svg',
    logoHtml: `<svg xmlns="http://www.w3.org/2000/svg" width="6" height="28" viewBox="0 0 24 48"><rect x="8" y="0" width="8" height="48" rx="2" fill="#c1d42f"/></svg><span style="font-family:'Orbitron',sans-serif;font-size:18px;font-weight:600;color:#1a1a1a;letter-spacing:-0.02em">Jason C. Lewis</span>`,
  },
};

const defaultTheme: BrandTheme = {
  name: 'Blog',
  displayFont: 'system-ui',
  bg: '#ffffff',
  surface: '#f9fafb',
  border: '#e5e7eb',
  text: '#1a1a1a',
  textMuted: '#555555',
  textFaint: '#999999',
  accent: '#2563eb',
  accentText: '#ffffff',
  faviconPath: '/favicon.svg',
};

export function getBrandTheme(): BrandTheme {
  const brand = import.meta.env.PUBLIC_BRAND;
  return brands[brand] || defaultTheme;
}
