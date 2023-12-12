import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { IStudente } from '../i-studente';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-import-studenti',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './import-studenti.component.html',
  styleUrl: './import-studenti.component.css'
})
export class ImportStudentiComponent implements AfterViewInit {
  datiStudenti!: IStudente[];
  studentiVisualizzati!: IStudente[];
  dataSource = new MatTableDataSource<IStudente>(this.studentiVisualizzati);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  classi!: string[];
  colonne: string[] = ['codicefiscale', 'cognome', 'nome', 'datanascita', 'sesso', 'classe', 'annoscolastico'];
  csvFile: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  convertCSVFile(event: any) {
    this.csvFile = event.target.files[0];

    if (this.csvFile) {
      const reader = new FileReader();

      reader.onload = (data: any) => {
        const csvData = data.target.result;
        let lines: string[] = csvData.split('\n');
        lines = lines.slice(1);
        this.datiStudenti = lines.map(line => {
          let fields = line.split(';');
          return {
            codiceFiscale: fields[2],
            cognome: fields[3],
            nome: fields[4],
            dataNascita: fields[6],    
            sesso: fields[5],
            classe: fields[15]+fields[16],   
            annoScolastico: fields[12],
          }
        })

        // Convertire il CSV in JSON
        this.studentiVisualizzati = this.datiStudenti;
        this.dataSource = new MatTableDataSource<IStudente>(this.studentiVisualizzati);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        console.log('ds', this.dataSource, this.paginator);
        this.classi = [... new Set(this.datiStudenti.map(studente => studente.classe))].sort();
        console.log(this.datiStudenti);

      };
      reader.readAsText(this.csvFile);
    }
  }

  filtraClasse(selectClasse: any) {
    let classe = selectClasse.value;
    if (classe === 'Tutte') {
      this.studentiVisualizzati = this.datiStudenti;
      console.log(this.studentiVisualizzati);
      this.dataSource = new MatTableDataSource<IStudente>(this.studentiVisualizzati);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      return;
    }
    this.studentiVisualizzati = this.datiStudenti.filter(studente => studente.classe === classe);
    this.dataSource = new MatTableDataSource<IStudente>(this.studentiVisualizzati);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
