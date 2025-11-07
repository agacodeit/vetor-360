import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface IdentifyOperationRequest {
    message: string;
}

export interface OpportunityVetor360DTO {
    operation: string;
    value: number;
    valueType: string;
    activityTypeEnum: string;
    status: string;
    country: string;
    city: string;
    state: string;
    term: string;
}

export interface IdentifyOperationResponse {
    opportunityVetor360DTO: OpportunityVetor360DTO;
    iaanalisys: string;
}

@Injectable({
    providedIn: 'root'
})
export class IdentifyOperationService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Identifica a melhor operação baseada na mensagem do usuário
     */
    identifyBetterOperation(data: IdentifyOperationRequest): Observable<IdentifyOperationResponse> {
        return this.http.post<IdentifyOperationResponse>(
            `${this.apiUrl}/secure/openai/identifyBetterOperation`,
            data
        );
    }
}
