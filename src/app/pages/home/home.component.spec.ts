import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { BuscaCepService } from '../../service/busca-cep.service';
import { ICep } from '../../interface/ICep.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('Busca Cep', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let cepServiceMock: jasmine.SpyObj<BuscaCepService>;
  let alertSpy: jasmine.Spy;

  //Dado simulados
  const mockCep = '08564810';
  const mockResponse: ICep = {
    bairro: "Jardim Madre Ângela",
    cep: "08564-810",
    complemento: "Bairro",
    ddd: "11",
    estado: "São Paulo",
    gia: "5460",
    ibge: "3539806",
    localidade: "Poá",
    logradouro: "Rua Olymio Martin Castro",
    regiao: "Sudeste",
    siafi: "6897",
    uf: "SP",
    unidade: "01",
    erro: 'false',
  };

  const mockErrorResponse: ICep = {
    bairro: "Jardim Madre Ângela",
    cep: mockCep,
    complemento: "Bairro",
    ddd: "11",
    estado: "São Paulo",
    gia: "5460",
    ibge: "3539806",
    localidade: "Poá",
    logradouro: "Rua Olymio Martin Castro",
    regiao: "Sudeste",
    siafi: "6897",
    uf: "SP",
    unidade: "01",
    erro: 'true', // Indica erro
  };

  beforeEach(async () => {

    // Mock do serviço BuscaCepService
    cepServiceMock = jasmine.createSpyObj('BuscaCepService', ['buscarCep']);

    // Espiando a função alert
    alertSpy = spyOn(window, 'alert');

    await TestBed.configureTestingModule({
        imports: [HomeComponent, ReactiveFormsModule],
        providers: [
            FormBuilder,
            { provide: BuscaCepService, useValue: cepServiceMock },  // Fornecendo o mock do serviço
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar o cep corretamente e atualizar o endereco', () => {
    // Simula a resposta bem-sucedida
    cepServiceMock.buscarCep.and.returnValue(of(mockResponse));

    // Define o valor do formulário
    component.formCep.setValue({ cep: mockCep });

    // // Chama a função de busca
    component.search();

    // // Verifica se o endereco foi atualizado
    expect(component.endereco.length).toBe(1);
    expect(component.endereco[0]).toEqual(mockResponse);
    expect(component.exibir).toBeTrue();
    expect(component.alertError).toEqual('');
    expect(alertSpy).not.toHaveBeenCalled();  // Não deve ter chamado o alert
  });

  it('deve exibir erro quando não for possível buscar o cep', () => {
    // Simula um erro na requisição
    cepServiceMock.buscarCep.and.returnValue(throwError(() => new Error('Erro ao buscar CEP')));

    // Define o valor do formulário
    component.formCep.setValue({ cep: mockCep });

    // Chama a função de busca
    component.search();

    // Verifica que o erro foi tratado
    expect(component.endereco.length).toBe(0);
    expect(component.exibir).toBeFalse();
    expect(component.alertError).toBe('Informe um cep!');
    expect(alertSpy).toHaveBeenCalledWith('Informe um cep!');  // O alert deve ser chamado com a mensagem de erro
  });

  it('deve exibir erro se o cep for invalido', () => {
    // Simula a resposta com erro no cep
    cepServiceMock.buscarCep.and.returnValue(of(mockErrorResponse));

    // Define o valor do formulário
    component.formCep.setValue({ cep: mockCep });

    // Chama a função de busca
    component.search();

    // Verifica que o erro foi tratado
    expect(component.endereco.length).toBe(1);
    expect(component.exibir).toBeFalse();
    expect(component.alertError).toBe('Cep invalido!');
    expect(alertSpy).toHaveBeenCalledWith('Cep invalido!');  // O alert deve ser chamado com a mensagem de erro
  });

});
