import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ProgramCourseCount, SectionTypeCount, TeachingLoad } from '../../models/models';
import { ToastService } from '../../services/toast.service';
import { IconComponent } from '../../components/icon/icon.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { downloadBlob } from '../../utils/download';
import Chart from 'chart.js/auto';

const OVERLOAD_THRESHOLD_HOURS = 200;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent],
  template: `
    <div class="page-header"><h2>Dashboard</h2></div>

    <div class="card">
      <div class="filters-row">
        <div class="filter-field">
          <label>Academic year</label>
          <select [(ngModel)]="filterYear" (ngModelChange)="refreshCharts()">
            <option [ngValue]="null">All years</option>
            <option *ngFor="let y of academicYears" [ngValue]="y">{{ y }}</option>
          </select>
        </div>
        <div class="filter-field">
          <label>Semester</label>
          <select [(ngModel)]="filterSemester" (ngModelChange)="refreshCharts()">
            <option [ngValue]="null">All semesters</option>
            <option [ngValue]="1">Semester 1</option>
            <option [ngValue]="2">Semester 2</option>
          </select>
        </div>
        <div class="filter-field">
          <label>&nbsp;</label>
          <button class="btn btn-secondary" type="button" (click)="downloadTeachingLoadCsv()">
            <app-icon name="download" [size]="14"></app-icon> Teaching load CSV
          </button>
        </div>
        <div class="filter-field">
          <label>&nbsp;</label>
          <button class="btn btn-secondary" type="button" (click)="downloadCoursesPerProgramCsv()">
            <app-icon name="download" [size]="14"></app-icon> Courses per program CSV
          </button>
        </div>
      </div>

      <div class="badge badge-danger" *ngFor="let l of overloadedLecturers" style="margin: 0 8px 8px 0;">
        <app-icon name="warning" [size]="12"></app-icon>
        {{ l.firstName }} {{ l.lastName }} — {{ l.totalHours }}h (over {{ overloadThreshold }}h)
      </div>
    </div>

    <div class="stats-grid">
      <div class="card chart-card">
        <h3>Teaching load per lecturer (hours)</h3>
        <div class="spinner-wrap" *ngIf="loadingCharts"><app-spinner></app-spinner></div>
        <canvas #loadChart [style.display]="loadingCharts ? 'none' : 'block'"></canvas>
      </div>
      <div class="card chart-card">
        <h3>Active courses per program</h3>
        <div class="spinner-wrap" *ngIf="loadingCharts"><app-spinner></app-spinner></div>
        <canvas #programChart [style.display]="loadingCharts ? 'none' : 'block'"></canvas>
      </div>
      <div class="card chart-card">
        <h3>Sections per type</h3>
        <div class="spinner-wrap" *ngIf="loadingCharts"><app-spinner></app-spinner></div>
        <canvas #typeChart [style.display]="loadingCharts ? 'none' : 'block'"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="page-header">
        <h3><app-icon name="compare" [size]="17"></app-icon> Compare academic years</h3>
      </div>
      <div class="filters-row">
        <div class="filter-field">
          <label>Year A</label>
          <select [(ngModel)]="compareYearA" (ngModelChange)="loadComparison()">
            <option *ngFor="let y of academicYears" [ngValue]="y">{{ y }}</option>
          </select>
        </div>
        <div class="filter-field">
          <label>Year B</label>
          <select [(ngModel)]="compareYearB" (ngModelChange)="loadComparison()">
            <option *ngFor="let y of academicYears" [ngValue]="y">{{ y }}</option>
          </select>
        </div>
      </div>

      <div class="compare-grid" *ngIf="compareA && compareB">
        <div class="compare-col">
          <h3>{{ compareYearA }}</h3>
          <p class="empty-state" *ngIf="!compareA.load.length">No teaching load data for this year.</p>
          <div *ngFor="let l of compareA.load">
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:2px;">
              <span>{{ l.firstName }} {{ l.lastName }}</span><span>{{ l.totalHours }}h</span>
            </div>
            <div style="background:#eef0f2; border-radius:4px; height:8px; margin-bottom:10px;">
              <div style="background:#0984e3; height:8px; border-radius:4px;" [style.width.%]="barWidth(l.totalHours, compareA.load)"></div>
            </div>
          </div>
        </div>
        <div class="compare-col">
          <h3>{{ compareYearB }}</h3>
          <p class="empty-state" *ngIf="!compareB.load.length">No teaching load data for this year.</p>
          <div *ngFor="let l of compareB.load">
            <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:2px;">
              <span>{{ l.firstName }} {{ l.lastName }}</span><span>{{ l.totalHours }}h</span>
            </div>
            <div style="background:#eef0f2; border-radius:4px; height:8px; margin-bottom:10px;">
              <div style="background:#00b894; height:8px; border-radius:4px;" [style.width.%]="barWidth(l.totalHours, compareB.load)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('loadChart') loadChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('programChart') programChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('typeChart') typeChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];
  loadingCharts = true;

  academicYears: number[] = [];
  filterYear: number | null = null;
  filterSemester: number | null = null;
  overloadThreshold = OVERLOAD_THRESHOLD_HOURS;
  overloadedLecturers: TeachingLoad[] = [];

  compareYearA: number | null = null;
  compareYearB: number | null = null;
  compareA: { load: TeachingLoad[]; programs: ProgramCourseCount[] } | null = null;
  compareB: { load: TeachingLoad[]; programs: ProgramCourseCount[] } | null = null;

  constructor(private api: ApiService, private toast: ToastService) {}

  ngAfterViewInit() {
    this.api.getAcademicYears().subscribe(years => {
      this.academicYears = years;
      if (years.length >= 2) {
        this.compareYearA = years[years.length - 2];
        this.compareYearB = years[years.length - 1];
      } else if (years.length === 1) {
        this.compareYearA = years[0];
        this.compareYearB = years[0];
      }
      this.loadComparison();
    });
    this.refreshCharts();
  }

  refreshCharts() {
    this.loadingCharts = true;
    this.charts.forEach(c => c.destroy());
    this.charts = [];

    const filter = { academicYear: this.filterYear, semester: this.filterSemester };
    let pending = 3;
    const done = () => { pending -= 1; if (pending === 0) this.loadingCharts = false; };

    this.api.getTeachingLoadStats(filter).subscribe(data => {
      this.overloadedLecturers = data.filter(d => d.totalHours > this.overloadThreshold);
      this.charts.push(new Chart(this.loadChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: data.map(d => `${d.firstName} ${d.lastName}`),
          datasets: [{
            label: 'Total hours',
            data: data.map(d => d.totalHours),
            backgroundColor: data.map(d => d.totalHours > this.overloadThreshold ? '#d63031' : '#0984e3')
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      }));
      done();
    });

    this.api.getCoursesPerProgram(filter).subscribe(data => {
      this.charts.push(new Chart(this.programChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: data.map(d => d.studyProgramName),
          datasets: [{
            label: 'Active courses',
            data: data.map(d => d.activeCourseCount),
            backgroundColor: '#00b894'
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      }));
      done();
    });

    this.api.getSectionsPerType(filter).subscribe(data => {
      this.charts.push(new Chart(this.typeChartRef.nativeElement, {
        type: 'pie',
        data: {
          labels: data.map(d => d.type),
          datasets: [{
            data: data.map(d => d.count),
            backgroundColor: ['#0984e3', '#00b894', '#fdcb6e']
          }]
        },
        options: { responsive: true }
      }));
      done();
    });
  }

  loadComparison() {
    if (this.compareYearA == null || this.compareYearB == null) return;

    this.api.getTeachingLoadStats({ academicYear: this.compareYearA }).subscribe(load => {
      this.compareA = { load, programs: this.compareA?.programs ?? [] };
    });
    this.api.getCoursesPerProgram({ academicYear: this.compareYearA }).subscribe(programs => {
      this.compareA = { load: this.compareA?.load ?? [], programs };
    });
    this.api.getTeachingLoadStats({ academicYear: this.compareYearB }).subscribe(load => {
      this.compareB = { load, programs: this.compareB?.programs ?? [] };
    });
    this.api.getCoursesPerProgram({ academicYear: this.compareYearB }).subscribe(programs => {
      this.compareB = { load: this.compareB?.load ?? [], programs };
    });
  }

  barWidth(value: number, list: TeachingLoad[]): number {
    const max = Math.max(...list.map(l => l.totalHours), 1);
    return Math.max(4, Math.round((value / max) * 100));
  }

  downloadTeachingLoadCsv() {
    const filter = { academicYear: this.filterYear, semester: this.filterSemester };
    this.api.exportTeachingLoadCsv(filter).subscribe({
      next: blob => { downloadBlob(blob, 'teaching-load.csv'); this.toast.success('Teaching load CSV downloaded'); },
      error: () => this.toast.error('Failed to export teaching load CSV')
    });
  }

  downloadCoursesPerProgramCsv() {
    const filter = { academicYear: this.filterYear, semester: this.filterSemester };
    this.api.exportCoursesPerProgramCsv(filter).subscribe({
      next: blob => { downloadBlob(blob, 'courses-per-program.csv'); this.toast.success('Courses per program CSV downloaded'); },
      error: () => this.toast.error('Failed to export courses per program CSV')
    });
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }
}
