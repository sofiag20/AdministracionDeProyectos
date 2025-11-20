import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'Calendario',
  standalone: true,
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css'],
  imports: [CommonModule]
})
export class Calendario {

  private http = inject(HttpClient);
  private router = inject(Router);   // ⭐ NECESARIO PARA EL BOTÓN REGRESAR

  API_URL = 'http://127.0.0.1:8000/api/calendario';

  months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  years: number[] = [];

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();

  days: any[] = [];
  eventos: any[] = [];

  selectedEventos: any[] = [];
  selectedDayNumber: number | null = null;

  constructor() {
    this.generateYearRange();
    this.getEventos();
  }

  // ⭐ FUNCIÓN PARA EL BOTÓN "REGRESAR"
  goBack() {
    this.router.navigate(['/equipo3']);
  }

  generateYearRange() {
    for (let y = 1980; y <= 2050; y++) {
      this.years.push(y);
    }
  }

  getEventos() {
    this.http.get<any[]>(`${this.API_URL}/eventos`).subscribe(data => {
      this.eventos = data;
      this.loadMonth();
    });
  }

  loadMonth() {
    this.days = [];

    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    // Lunes = 0 ... Domingo = 6
    const weekDayStart = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    for (let i = 0; i < weekDayStart; i++) {
      this.days.push({ empty: true });
    }

    for (let day = 1; day <= lastDay; day++) {
      const fecha = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;

      const eventosDelDia = this.eventos.filter(e => e.fecha === fecha);

      this.days.push({
        day,
        eventos: eventosDelDia.length > 0 ? eventosDelDia : null,
        isToday:
          this.currentYear === new Date().getFullYear() &&
          this.currentMonth === new Date().getMonth() &&
          day === new Date().getDate()
      });
    }

    this.selectedEventos = [];
    this.selectedDayNumber = null;
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.loadMonth();
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.loadMonth();
  }

  changeYear(event: any) {
    this.currentYear = Number(event.target.value);
    this.loadMonth();
  }

  openDay(d: any) {
    if (!d || d.empty) return;

    this.selectedDayNumber = d.day;
    this.selectedEventos = d.eventos ? d.eventos : [];
  }

}
