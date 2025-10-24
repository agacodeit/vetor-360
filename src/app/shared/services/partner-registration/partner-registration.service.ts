import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';


export interface PartnerRegistrationRequest {
    comercialPhone?: string;
    annualBilling?: number;
    partnerName?: string;
    foundingDate?: string;
    responsibleCompanyName?: string;
    name: string;
    password: string;
    email: string;
    userTypeEnum: 'PARCEIRO_ACESSEBANK';
    monthlyIncome?: number;
    profissionalActivity?: string;
    maritalStatus?: string;
    cpfCnpj: string;
    cellphone: string;
    personType: 'F' | 'J';
    filesToAdd: any[];
    documents: PartnerDocument[];
    temporaryPass: boolean;
    address: PartnerAddress;
    activityBranch?: string;
    blockDistributionToPlayers: any[];
    id?: string;
    confirmPassword: string;
}

export interface PartnerDocument {
    id: string;
    description: string;
    files: PartnerDocumentFile[];
}

export interface PartnerDocumentFile {
    documentDraftId: string;
    fileCode: string;
    fileName: string;
}

export interface PartnerAddress {
    cep: string;
    street: string;
    city: string;
    state: string;
    neighbourhood: string;
    complement?: string;
}

export interface PartnerRegistrationResponse {
    success: boolean;
    message: string;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})
export class PartnerRegistrationService {
    private readonly apiUrl = environment.apiUrl || 'https://hml.acessebank.com.br/acessebankapi/api/v1';

    constructor(private http: HttpClient) { }

    /**
     * Cria um novo parceiro
     */
    createPartner(partnerData: PartnerRegistrationRequest): Observable<PartnerRegistrationResponse> {
        return this.http.post<PartnerRegistrationResponse>(
            `${this.apiUrl}/user/create`,
            partnerData
        );
    }


    /**
     * Upload de arquivo
     */
    uploadFile(file: File, documentId: string): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentId', documentId);

        return this.http.post(`${this.apiUrl}/documents/upload`, formData);
    }

    /**
     * Valida CPF
     */
    validateCpf(cpf: string): boolean {
        // Remove caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');

        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        // Validação do CPF
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    /**
     * Valida CNPJ
     */
    validateCnpj(cnpj: string): boolean {
        // Remove caracteres não numéricos
        cnpj = cnpj.replace(/\D/g, '');

        // Verifica se tem 14 dígitos
        if (cnpj.length !== 14) return false;

        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        // Validação do CNPJ
        let size = cnpj.length - 2;
        let numbers = cnpj.substring(0, size);
        let digits = cnpj.substring(size);
        let sum = 0;
        let pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) return false;

        size = size + 1;
        numbers = cnpj.substring(0, size);
        sum = 0;
        pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(1))) return false;

        return true;
    }

    /**
     * Formata dados para envio à API
     */
    formatDataForApi(formData: any): PartnerRegistrationRequest {
        return {
            name: formData.name,
            cpfCnpj: formData.cpfCnpj.replace(/\D/g, ''), // Remove máscara
            email: formData.email,
            cellphone: formData.cellphone.replace(/\D/g, ''), // Remove máscara
            comercialPhone: formData.comercialPhone?.replace(/\D/g, '') || undefined,
            responsibleCompanyName: formData.responsibleCompanyName || undefined,
            personType: formData.personType,
            userTypeEnum: 'PARCEIRO_ACESSEBANK',
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            address: {
                cep: formData.address.cep.replace(/\D/g, ''), // Remove máscara
                street: formData.address.street,
                city: formData.address.city,
                state: formData.address.state,
                neighbourhood: formData.address.neighbourhood,
                complement: formData.address.complement || undefined
            },
            documents: formData.documents || [],
            filesToAdd: [],
            temporaryPass: false,
            blockDistributionToPlayers: []
        };
    }
}
