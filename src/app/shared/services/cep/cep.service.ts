import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface CepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CepService {
    private readonly VIA_CEP_URL = 'https://viacep.com.br/ws';

    constructor(private http: HttpClient) { }

    /**
     * Busca informações do CEP na API do ViaCEP
     * @param cep CEP a ser consultado (com ou sem formatação)
     * @returns Observable com os dados do endereço ou erro
     */
    getCepInfo(cep: string): Observable<CepResponse | null> {
        // Remove formatação do CEP
        const cleanCep = cep.replace(/\D/g, '');

        // Valida se o CEP tem 8 dígitos
        if (cleanCep.length !== 8) {
            return of(null);
        }

        const url = `${this.VIA_CEP_URL}/${cleanCep}/json`;

        return this.http.get<CepResponse>(url).pipe(
            map(response => {
                // Se a API retornar erro, retorna null
                if (response.erro) {
                    return null;
                }
                return response;
            }),
            catchError(error => {
                console.error('Erro ao buscar CEP:', error);
                return of(null);
            })
        );
    }

    /**
     * Valida se o CEP está no formato correto
     * @param cep CEP a ser validado
     * @returns true se o CEP é válido
     */
    isValidCep(cep: string): boolean {
        const cleanCep = cep.replace(/\D/g, '');
        return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep);
    }

    /**
     * Formata o CEP para exibição
     * @param cep CEP sem formatação
     * @returns CEP formatado (00000-000)
     */
    formatCep(cep: string): string {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            return cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        return cep;
    }
}
