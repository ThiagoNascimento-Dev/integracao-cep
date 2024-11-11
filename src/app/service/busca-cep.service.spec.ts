import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController  } from '@angular/common/http/testing';
import { BuscaCepService } from './busca-cep.service';
import { ICep } from '../interface/ICep.interface';
import { environment } from '../../environments/environment.prod';

describe('Requisição da API', () => {
  let service: BuscaCepService;
  let httpMock: HttpTestingController;

  const mockCep = '08564810';
  const mockResponse: ICep = {
    bairro: "Jardim Madre Ângela",
    cep: "08564-810",
    complemento: "",
    ddd: "11",
    estado: "São Paulo",
    gia: "5460",
    ibge: "3539806",
    localidade: "Poá",
    logradouro: "Rua Olymio Martin Castro",
    regiao: "Sudeste",
    siafi: "6897",
    uf: "SP",
    unidade: "",
    erro: 'false',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuscaCepService]
    });
    service = TestBed.inject(BuscaCepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica se há requisições pendentes após cada teste
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar a API e retornar os dados do CEP corretamente', () => {
    // Chama o método 'buscarCep' e subscreve o resultado
    service.buscarCep(mockCep).subscribe((cepData) => {
      // Verifica se os dados retornados são os mesmos do mock
      expect(cepData).toEqual(mockResponse);
    });

    // Intercepta a requisição HTTP e fornece a resposta mockada
    const req = httpMock.expectOne(`${environment.urlBase}${mockCep}/json/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);  // Retorna a resposta mockada
  });

  it('deve retornar erro quando a requisição falhar', () => {
    const errorMessage = 'Erro ao buscar o CEP';

    // Chama o método 'buscarCep' e subscreve
    service.buscarCep(mockCep).subscribe({
      next: () => fail('Deveria ter falhado!'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.error).toBe(errorMessage);
      },
    });

    // Intercepta a requisição HTTP e simula um erro
    const req = httpMock.expectOne(`${environment.urlBase}${mockCep}/json/`);
    expect(req.request.method).toBe('GET');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
  
});
