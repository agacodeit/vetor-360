import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface MatchingAnalysis {
    id: string;
    opportunityId: string;
    analysisDate: string;
    analysisText: string;
}

@Injectable({
    providedIn: 'root'
})
export class MatchingService {
    private readonly baseUrl = `${environment.apiUrl}/secure/opportunity-vetor360`;

    constructor(private http: HttpClient) { }

    executeAnalysis(opportunityId: string): Observable<MatchingAnalysis> {
        return this.http.post<MatchingAnalysis>(`${this.baseUrl}/executarAnalise/${opportunityId}`, {});
    }
}
