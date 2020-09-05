import { Component, OnInit, Input } from '@angular/core';
import { Archivo } from '@models/file';
import { CuestionarioService } from '@cuestionario_service/*';
import { Asignacion } from '@models/aula';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-aula-asignaciones',
  templateUrl: './aula-asignaciones.component.html'
})
export class AulaAsignacionesComponent implements OnInit {
  @Input() asignaciones: Asignacion[];
  archivos: Archivo[];

  constructor(private http: CuestionarioService) {}

  ngOnInit(): void {
    this.http.getFiles().subscribe((archivos: Archivo[]) => {
      if(archivos?.length > 0) {
        this.archivos = this.makeTree(archivos);
      }
    }); 
  }

  private makeTree(archivo: Archivo[]): Archivo[] {
    let tree: Archivo[] = [];
    let indexed_archivos: Archivo[] = [];
    for (let i = 0; i < archivo.length; i++) {
      archivo[i].archivos = [];
      indexed_archivos[archivo[i].id] = archivo[i];
    }
    for (let i = 0; i < archivo.length; i++) {
      var parent_id = archivo[i].parent_id;
      if (parent_id === null) {
        tree.push(archivo[i]);
      } else {
        indexed_archivos[parent_id].archivos.push(archivo[i]);
      }
    }
    return tree;
  }

  addAsignacion() {
    const asignacion: Asignacion = { id: uuid(), tema: '', fecha: '', tiempo: '', cuestionarios: [] };
    this.asignaciones.unshift(asignacion);
  }
}
