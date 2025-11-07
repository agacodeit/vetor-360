import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface OpportunityCreateRequest {
    operation: string;
    value: number;
    valueType: string;
    activityTypeEnum: string;
    term: string;
    country: string;
    city: string;
    state: string;
    customerName: string;
    guarantee: string;
}

export interface OpportunityCreateResponse {
    id: string;
    status: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OpportunityService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Cria uma nova oportunidade
     */
    createOpportunity(data: OpportunityCreateRequest): Observable<OpportunityCreateResponse> {
        return this.http.post<OpportunityCreateResponse>(
            `${this.apiUrl}/secure/opportunity-vetor360/create`,
            data
        );
    }
}
