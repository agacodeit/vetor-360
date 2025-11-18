import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DocumentPayload {
    description: string;
}

export interface DocumentResponse {
    id: string;
    description: string;
}

export interface LinkMultipleFilesRequest {
    fileCode: string;
    opportunityId: string;
    opportunityDocumentId: string;
}

export interface UploadFileResponse {
    fileCode?: string;
    id?: string;
    url?: string;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * Cria documentos necessários baseado no tipo de pessoa
     */
    createDocument(personType: 'F' | 'J'): Observable<DocumentResponse[]> {
        const documentsPayload = this.getDocumentsPayload(personType);

        return this.http.post<DocumentResponse[]>(
            `${this.apiUrl}/documents/createDocument`,
            documentsPayload
        );
    }

    /**
     * Retorna o payload de documentos baseado no tipo de pessoa
     */
    private getDocumentsPayload(personType: 'F' | 'J'): DocumentPayload[] {
        if (personType === 'F') {
            return [
                { description: 'RG ou CNH' },
                { description: 'Comprovante de endereço' }
            ];
        }

        return [
            { description: 'Contrato Social' },
            { description: 'Última alteração contratual consolidada' },
            { description: 'RG ou CNH' }
        ];
    }

    /**
     * Valida arquivo antes do upload
     */
    validateFile(file: File, documentId: string): Observable<{ success: boolean, message: string }> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<{ success: boolean, message: string }>(
            `${this.apiUrl}/secure/openai/validateFile?documentId=${documentId}`,
            formData
        );
    }

    /**
     * Upload de arquivo para um documento específico
     */
    uploadFile(file: File): Observable<UploadFileResponse> {
        const formData = new FormData();
        formData.append('arquivo', file);

        return this.http.post<UploadFileResponse>(this.apiUrl + '/bucket/upload', formData);
    }

    /**
     * Linka múltiplos arquivos a uma oportunidade
     */
    linkMultipleFiles(files: LinkMultipleFilesRequest[]): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/secure/opportunity-vetor360/linkMultipleFiles`,
            files
        );
    }

    /**
     * Lista todos os documentos de um usuário
     */
    getDocuments(): Observable<DocumentResponse[]> {
        return this.http.get<DocumentResponse[]>(`${this.apiUrl}/list`);
    }

    /**
     * Remove um arquivo de documento de oportunidade
     * @param fileId - ID do arquivo a ser removido
     */
    removeDocumentFile(fileId: string): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/secure/opportunity-vetor360/removeDocumentFile?fileId=${fileId}`
        );
    }
}
