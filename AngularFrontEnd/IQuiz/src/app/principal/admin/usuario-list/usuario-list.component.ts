import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService }  from '../admin.service';
import { User, Rol } from '@models/auth';
import { HttpResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html'
})
export class UsuarioListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['nombres', 'correoInstitucional', 'rol', 'ingreso', 'modificacion', 'accion'];
  dataSource: MatTableDataSource<User>;

  constructor(
    private router: Router,
    private service: AdminService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.service.getUsers().subscribe(usuarios => {
      if(usuarios?.length > 0) {
        usuarios.forEach(usuario => usuario.rol = (usuario.rol as Rol).descripcion);
        this.dataSource = new MatTableDataSource(usuarios);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateEstado(user: User) {
    if(user.estado == 1) {
      this.service.disabledUser(user.id).subscribe((response: HttpResponse<Object>) => {
        if(response.status == 200) {
          user.estado = 0;
        } else {
          this.snackBar.open('No se ha desactivado el usuario','Error', { duration: 2000 });
        }
      });
    } else {
      this.service.enabledUser(user.id).subscribe((response: HttpResponse<Object>) => {
        if(response.status == 200) {
          user.estado = 1;
        } else {
          this.snackBar.open('No se ha activado el usuario','Error', { duration: 2000 });
        }
      });
    }
  }

  navigate = (url: string, id?: string) => id ? this.router.navigate([url, id]) : this.router.navigate([url]);
}
