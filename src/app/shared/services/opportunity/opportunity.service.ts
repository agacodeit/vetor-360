import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
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

export type OpportunityStatus =
    | 'PENDING_DOCUMENTS'
    | 'IN_ANALYSIS'
    | 'IN_NEGOTIATION'
    | 'WAITING_PAYMENT'
    | 'FUNDS_RELEASED';

export interface OpportunityDocument {
    id: string;
    documentType: string;
    opportunityId: string;
    required: boolean;
    initialDocument: boolean;
    dateHourIncluded: string;
    userIncludedId?: string;
    documentStatusEnum: string;
}

export interface OpportunitySummary {
    operation: string;
    id: string;
    value: number;
    valueType: string;
    activityTypeEnum: string;
    status: OpportunityStatus;
    dateHourIncluded: string;
    documents?: OpportunityDocument[];
    country?: string;
    city?: string;
    state?: string;
    term?: string;
    guarantee?: string;
    customerName?: string;
}

export interface OpportunitySearchRequest {
    status?: OpportunityStatus | null;
    customerName?: string | null;
    userId?: string | null;
    dataCriacao?: string | null;
    page?: number;
    size?: number;
}

export interface OpportunitySearchResponse {
    content: OpportunitySummary[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
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

    /**
     * Busca oportunidades com filtros e paginação
     */
    searchOpportunities(request: OpportunitySearchRequest): Observable<OpportunitySearchResponse> {
        const payload: any = {
            page: request.page ?? 0,
            size: request.size ?? 20
        };

        if (request.status) {
            payload.status = request.status;
        }

        if (request.customerName?.trim()) {
            payload.customerName = request.customerName.trim();
        }

        if (request.userId?.trim()) {
            payload.userId = request.userId.trim();
        }

        if (request.dataCriacao?.trim()) {
            payload.dataCriacao = request.dataCriacao.trim();
        }

        return this.http.post<OpportunitySearchResponse>(
            `${this.apiUrl}/secure/opportunity-vetor360/search`,
            payload
        );
    }

    async getOpportunityById(id: string): Promise<OpportunitySummary> {
        return await lastValueFrom(this.http.get<OpportunitySummary>(
            `${this.apiUrl}/secure/opportunity-vetor360/${id}`
        ));
    }
}
