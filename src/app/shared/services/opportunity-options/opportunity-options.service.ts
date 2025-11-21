import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface OperationType {
    description: string;
    key: string;
}

export interface ActivityType {
    description: string;
    key: string;
}

@Injectable({
    providedIn: 'root'
})
export class OpportunityOptionsService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Busca os tipos de operação disponíveis
     */
    getOperationTypes(): Observable<OperationType[]> {
        return this.http.get<OperationType[]>(
            `${this.apiUrl}/types/operation-types`
        );
    }

    /**
     * Busca os tipos de atividade disponíveis
     */
    getActivityTypes(): Observable<ActivityType[]> {
        return this.http.get<ActivityType[]>(
            `${this.apiUrl}/types/activity-types`
        );
    }
}
