const paths = {
  home: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  demands: '<path d="M7 5H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2M8 12h8m-8 4h6"/><rect x="7" y="3" width="10" height="4" rx="1"/>',
  factory: '<path d="M3 21V9l6 3V8l6 3V3h6v18H3Zm4-5h2m3 0h2m3 0h1"/>',
  context: '<path d="M3 21V3h12v18m0-12h6v12M7 7h4m-4 5h4m-4 5h4M2 21h20"/>',
  reviews: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  settings: '<path d="m9 3-1 3-3 1-2 3 2 2-1 3 2 3 3-1 3 2 3-2 3 1 2-3-1-3 2-2-2-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
  theme: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M12 4a8 8 0 0 1 0 16"/>',
  switch: '<path d="M4 7h16m-4-4 4 4-4 4M20 17H4m4-4-4 4 4 4"/>',
  logout: '<path d="M9 3H4v18h5M10 12h11m-4-4 4 4-4 4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  document: '<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h5"/>',
  match: '<circle cx="8" cy="12" r="5"/><circle cx="16" cy="12" r="5"/>',
  proposals: '<path d="M4 4h16v12H9l-5 4zM8 8h8M8 12h5"/>',
  order: '<path d="m3 7 9-4 9 4v11l-9 4-9-4zM3 7l9 4 9-4M12 11v11"/>',
  inspection: '<circle cx="10" cy="10" r="6"/><path d="m14 14 7 7m-14-11 2 2 4-4"/>',
  truck: '<path d="M2 5h12v12H2zM14 9h4l4 4v4h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrowLeft: '<path d="M20 12H4m7-7-7 7 7 7"/>',
};

export const uiIcon = (name) => `<svg class="ui-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.document}</svg>`;
