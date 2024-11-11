import { BuscaCepService } from './../../service/busca-cep.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ICep } from '../../interface/ICep.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{

  formCep: FormGroup = this.fb.group({
    cep: [""]
  });

  endereco: ICep[]=[];
  alertError: string = '';
  exibir: boolean = false;
  
  constructor(
    private CepService: BuscaCepService,
    private fb: FormBuilder,
  ){}


  search() {
    this.endereco.splice(0, this.endereco.length);
    let cep = this.formCep.value.cep;
    this.CepService.buscarCep(cep).subscribe({
      next: (cep) => {
        this.endereco.push(cep);
        this.exibir = true;
      },
      error: (error) => {
        this.alertError = 'Informe um cep!';
        alert(this.alertError);
        this.exibir = false;
      },
      complete: () => {
        if (this.endereco[0].erro === 'true') {
          this.alertError = 'Cep invalido!';
          alert(this.alertError);
          this.exibir = false;
        }
      }
      
    });
    console.log(this.endereco);
  }

}
