

export function copyToClipboard(internalReference: string, event?: MouseEvent) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(internalReference).then(() => {
        }).catch(err => {
        });
    } else {

        const textArea = document.createElement('textarea');
        textArea.value = internalReference;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
        }
        document.body.removeChild(textArea);
    }
}

/**
 * 🔧 FERRAMENTAS BÁSICAS
 * Utilitários simplificados após remoção das models
 */
export class BasicTools {

    /**
     * 📋 COPIAR TEXTO
     * Copia texto para a área de transferência
     */
    static copyText(text: string): Promise<void> {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            return Promise.reject('Clipboard API not available');
        }
    }

    /**
     * 🎲 GERAR ID ÚNICO
     * Gera um ID único simples
     */
    static generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * 📅 FORMATAR DATA
     * Formata data para exibição
     */
    static formatDate(date: Date): string {
        return date.toLocaleDateString('pt-BR');
    }

    /**
     * 🕒 FORMATAR HORA
     * Formata hora para exibição
     */
    static formatTime(date: Date): string {
        return date.toLocaleTimeString('pt-BR');
    }
}
