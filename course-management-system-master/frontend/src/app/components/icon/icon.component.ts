import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const ICONS: Record<string, string> = {
  dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  faculty: '<path d="M3 9.5 12 4l9 5.5-9 5.5-9-5.5Z"/><path d="M6.5 11.5V17c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-5.5"/><path d="M20.5 9.5V16"/>',
  department: '<path d="M4 21V7a1 1 0 0 1 1-1h5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2h5a1 1 0 0 1 1 1v14"/><path d="M4 21h16"/><path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/>',
  program: '<path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12.5V17c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/>',
  course: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5V4.5Z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
  activeCourse: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18"/><path d="M8 2v4M16 2v4"/><path d="m8.5 14 2 2 4-4"/>',
  section: '<rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><circle cx="17" cy="8.5" r="2.6"/><path d="M15.5 14.7c2.4.3 4 2.3 4 5.3"/>',
  category: '<path d="M12 2 3 7.5v9L12 22l9-5.5v-9L12 2Z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/><path d="M10 11v6M14 11v6"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="m4 12 5 5 11-11"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><path d="M12 7.5v.01"/>',
  warning: '<path d="M10.6 3.9 2.2 18.3a1.3 1.3 0 0 0 1.1 2h17.4a1.3 1.3 0 0 0 1.1-2L13.4 3.9a1.3 1.3 0 0 0-2.8 0Z"/><path d="M12 9.5v4.5"/><path d="M12 17v.01"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19h16"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  workload: '<path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z"/><path d="M12 7v5l3.5 2"/>',
  compare: '<path d="M9 3v18"/><path d="M15 3v18"/><path d="M5 8h4M15 8h4M5 16h4M15 16h4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="app-icon"
      [innerHTML]="path"
    ></svg>
  `,
  styles: [`.app-icon { display: inline-block; vertical-align: -3px; flex-shrink: 0; }`]
})
export class IconComponent {
  @Input() name = 'info';
  @Input() size = 16;
  @Input() strokeWidth = 2;

  constructor(private sanitizer: DomSanitizer) {}

  // Icon markup is a fixed, developer-authored set (never user input), so
  // bypassing sanitization is safe and needed: Angular's default HTML
  // sanitizer strips SVG shape children (path/rect/circle) from [innerHTML].
  get path(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name] ?? ICONS['info']);
  }
}
