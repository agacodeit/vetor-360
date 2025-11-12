import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CommentDTO {
    id?: string;
    text: string;
    responseMail?: boolean;
    opportunityId: string;
    dateHourIncluded?: string;
    dateHourUpdated?: string;
    userIncludedId?: string;
    userNameIncluded?: string;
    toUserId?: string;
}

export interface CommentCreateRequest {
    text: string;
    opportunityId: string;
    responseMail?: boolean;
    toUserId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private readonly baseUrl = `${environment.apiUrl}/secure/opportunity-vetor360`;

    constructor(private http: HttpClient) { }

    listComments(opportunityId: string): Observable<CommentDTO[]> {
        return this.http.get<CommentDTO[]>(`${this.baseUrl}/comments/${opportunityId}`);
    }

    addComment(payload: CommentCreateRequest): Observable<CommentDTO> {
        return this.http.post<CommentDTO>(`${this.baseUrl}/addComment`, payload);
    }
}


