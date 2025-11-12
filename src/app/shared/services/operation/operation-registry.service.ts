import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { OpportunityOptionsService, OperationType } from '../opportunity-options/opportunity-options.service';

@Injectable({
    providedIn: 'root'
})
export class OperationRegistryService {
    private readonly operationTypesSubject = new BehaviorSubject<OperationType[]>([]);
    private isLoaded = false;
    private loadPromise: Promise<void> | null = null;

    constructor(private opportunityOptionsService: OpportunityOptionsService) { }

    loadOperationTypes(): Promise<void> {
        if (this.isLoaded) {
            return Promise.resolve();
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = firstValueFrom(this.opportunityOptionsService.getOperationTypes())
            .then(types => {
                this.operationTypesSubject.next(types ?? []);
                this.isLoaded = true;
            })
            .catch(error => {
                console.error('Erro ao carregar tipos de operação:', error);
                this.operationTypesSubject.next([]);
            })
            .finally(() => {
                this.loadPromise = null;
            });

        return this.loadPromise;
    }

    getOperationTypes(): OperationType[] {
        return this.operationTypesSubject.value;
    }

    watchOperationTypes(): Observable<OperationType[]> {
        return this.operationTypesSubject.asObservable();
    }

    getOperationLabel(operationKey?: string | null): string {
        if (!operationKey) {
            return '';
        }

        const match = this.operationTypesSubject.value.find(type => type.key === operationKey);
        return match?.description || operationKey;
    }
}


