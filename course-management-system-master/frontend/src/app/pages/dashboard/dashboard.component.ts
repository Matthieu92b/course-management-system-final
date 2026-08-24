import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header"><h2>Dashboard</h2></div>

    <div class="stats-grid">
      <div class="card chart-card">
        <h3>Teaching load per lecturer (hours)</h3>
        <canvas #loadChart></canvas>
      </div>
      <div class="card chart-card">
        <h3>Active courses per program</h3>
        <canvas #programChart></canvas>
      </div>
      <div class="card chart-card">
        <h3>Sections per type</h3>
        <canvas #typeChart></canvas>
      </div>
    </div>
  `
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('loadChart') loadChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('programChart') programChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('typeChart') typeChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  constructor(private api: ApiService) {}

  ngAfterViewInit() {
    this.api.getTeachingLoadStats().subscribe(data => {
      this.charts.push(new Chart(this.loadChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: data.map(d => `${d.firstName} ${d.lastName}`),
          datasets: [{
            label: 'Total hours',
            data: data.map(d => d.totalHours),
            backgroundColor: '#0984e3'
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      }));
    });

    this.api.getCoursesPerProgram().subscribe(data => {
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
    });

    this.api.getSectionsPerType().subscribe(data => {
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
    });
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }
}
