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
                { description: 'Rg ou CNH' },
                { description: 'CPF' },
                { description: 'Comprovante de Residência no endereço cadastrado' }
            ];
        } else {
            return [
                { description: 'CCMEI ou Contrato Social' },
                { description: 'RG ou CNH dos Sócios' },
                { description: 'Cartão de CNPJ' },
                { description: 'Conta de consumo em nome da empresa no endereço cadastrado' },
                { description: 'Conta de consumo em nome dos sócios' }
            ];
        }
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
            `${this.apiUrl}/secure/opportunity/linkMultipleFiles`,
            files
        );
    }

    /**
     * Lista todos os documentos de um usuário
     */
    getDocuments(): Observable<DocumentResponse[]> {
        return this.http.get<DocumentResponse[]>(`${this.apiUrl}/list`);
    }
}
