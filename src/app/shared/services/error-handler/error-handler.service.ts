import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Interface para a resposta de erro padrão do backend
 */
export interface BackendErrorResponse {
    error?: string;
    message?: string;
}

/**
 * Mapeamento de códigos de erro para mensagens traduzidas
 */
const ERROR_MESSAGES_MAP: { [key: string]: string } = {
    // Login errors
    'login.pendingConfirmation': 'Usuário pendente de confirmação',
    'login.invalidaccount': 'Conta inválida',
    'login.invalidcredentials': 'Credenciais inválidas',
    'login.invalidcredentials. Remaining attempts: ': 'Credenciais inválidas com tentativas restantes',
    'login.invalidparameters': 'Parâmetros de login inválidos',
    'login.accountblocked': 'Conta bloqueada',

    // User errors
    'user.blocked': 'Usuário bloqueado',
    'user.cpfCnpj.cannotChange': 'CPF/CNPJ não pode ser alterado',
    'user.email.cannotChange': 'Email não pode ser alterado',
    'user.findByCpfCnpj.exists': 'CPF/CNPJ já existe',
    'user.findByEmail.exists': 'Email já existe',
    'user.forgotPassword.emailNotExists': 'Email não existe na recuperação de senha',
    'user.forgotPassword.notPermitted': 'Recuperação de senha não permitida',
    'user.id.invalid': 'ID de usuário inválido',
    'user.invalid.parameters': 'Parâmetros inválidos',
    'user.list.error': 'Erro ao listar usuários',
    'user.newPassword.emailNotExists': 'Email não existe na nova senha',
    'user.newPassword.expired': 'Nova senha expirada',
    'user.newPassword.invalidRecoveryUserPasswordId': 'ID de recuperação de senha inválido',
    'user.newPassword.notPermitted': 'Nova senha não permitida',
    'user.notFound': 'Usuário não encontrado',
    'user.password.required': 'Senha obrigatória',
    'user.type.notSupported': 'Tipo de usuário não suportado',
    'user.userNotFound': 'Usuário não encontrado',

    // UserService errors
    'userService.changaUserStatus.error': 'Erro ao alterar status do usuário',
    'userService.changeEmailConfirmation.error': 'Erro ao confirmar alteração de email',
    'userService.changeNotifyClientsFlag.invalidUser': 'Usuário inválido para alterar flag de notificação',
    'userService.emailAlreadyExists.error': 'Email já existe',
    'userService.findAllByCustomFilter.error': 'Erro ao buscar usuários com filtro customizado',
    'userService.getRequestMasterAccessRequestByUserId.noRequestFound': 'Nenhuma solicitação de acesso master encontrada',
    'userService.inforceMasterAccess.invalidUser': 'Usuário inválido para forçar acesso master',
    'userService.noUserFound.error': 'Nenhum usuário encontrado',
    'userService.requestMasterAccess.error': 'Erro ao solicitar acesso master',
    'userService.requestMasterAccess.invalidMasterRequestId': 'ID de solicitação master inválido',
    'userService.resendLoginPassword.error': 'Erro ao reenviar senha de login',
    'userService.resetMasterAccess.invalidUser': 'Usuário inválido para resetar acesso master',
    'userService.update.userNotFound': 'Usuário não encontrado para atualização',

    // Opportunity errors
    'opportunity.error': 'Erro genérico em oportunidade',
    'opportunity.id.invalid': 'ID de oportunidade inválido',
    'opportunity.invalidCustomerId': 'ID de cliente inválido',
    'opportunity.invalidParameters': 'Parâmetros inválidos',
    'opportunity.list.error': 'Erro ao listar oportunidades',
    'opportunity.notFound': 'Oportunidade não encontrada',

    // OpportunityService errors
    'opportunityService.addDocument.opportunityIdIsRequired': 'ID de oportunidade obrigatório ao adicionar documento',
    'opportunityService.addDocument.opportunityIdNotFound': 'ID de oportunidade não encontrado ao adicionar documento',
    'opportunityService.addFundRelease.opportunityIdIsRequired': 'ID de oportunidade obrigatório ao adicionar liberação de fundos',
    'opportunityService.findAllByCustomFilter.error': 'Erro ao buscar oportunidades com filtro customizado',
    'opportunityService.issueContract.invalidAcessebanker': 'Acessebanker inválido para emitir contrato',
    'opportunityService.issueContract.playerInvalid': 'Player inválido para emitir contrato',
    'opportunityService.listAll.error': 'Erro ao listar todas as oportunidades',
    'opportunityService.listAllComments.error': 'Erro ao listar todos os comentários',
    'opportunityService.removeDocument.documentIdNotFound': 'ID de documento não encontrado ao remover',
    'opportunityService.removeDocumentFile.documentFileIdNotFound': 'ID de arquivo de documento não encontrado',
    'opportunityService.setAgent.invalidAgent': 'Agente inválido',
    'opportunityService.setAgent.opportunityIdNotFound': 'ID de oportunidade não encontrado ao definir agente',
    'opportunityService.setPartner.hasReceiptToAgent': 'Existe recibo para o agente',
    'opportunityService.setPartner.hasReceiptToPartner': 'Existe recibo para o parceiro',
    'opportunityService.setPartner.invalidPartner': 'Parceiro inválido',
    'opportunityService.setPartner.opportunityIdNotFound': 'ID de oportunidade não encontrado ao definir parceiro',
    'opportunityService.setPlayer.opportunityIdNotFound': 'ID de oportunidade não encontrado ao definir player',

    // OpportunityVetor360Service errors
    'opportunityVetor360Service.addComment.error': 'Erro ao adicionar comentário',
    'opportunityVetor360Service.addComment.opportunityIdIsRequired': 'ID de oportunidade obrigatório ao adicionar comentário',
    'opportunityVetor360Service.addComment.opportunityNotFound': 'Oportunidade não encontrada ao adicionar comentário',
    'opportunityVetor360Service.addComment.userNotFound': 'Usuário não encontrado ao adicionar comentário',
    'opportunityVetor360Service.listAllComments.error': 'Erro ao listar todos os comentários',
    'opportunityVetor360Service.listAllComments.userNotFound': 'Usuário não encontrado ao listar comentários',

    // ProposalService errors
    'proposalService.addProposal.counterproposalHasAlreadyBeenRefused': 'Contrap proposta já foi recusada',
    'proposalService.addProposal.hasAcceptedProposal': 'Já existe proposta aceita',
    'proposalService.addProposal.hasPendingProposalInMatch': 'Já existe proposta pendente no match',
    'proposalService.changeStatus.proposalNotFound': 'Proposta não encontrada ao alterar status',
    'proposalService.createDirectOpportunityMatch.error': 'Erro ao criar match direto de oportunidade',
    'proposalService.createDirectOpportunityMatch.existingMatchForThisPlayer': 'Já existe match para este player',
    'proposalService.getMatchInOpportunity.error': 'Erro ao obter match na oportunidade',
    'proposalService.getMatchInOpportunity.opportunityNotFound': 'Oportunidade não encontrada ao obter match',

    // QuestionnaireService errors
    'questionnaireService.createQuestionnaire.invalidUserId': 'ID de usuário inválido ao criar questionário',
    'questionnaireService.updateQuestionnaire.invalidUserId': 'ID de usuário inválido ao atualizar questionário',

    // OpportunityMatchService errors
    'OpportunityMatchService.findAllByCustomFilter.error': 'Erro ao buscar matches com filtro customizado',
    'OpportunityMatchService.findAllMatchByPlayerIdAndStatusCustomFilter.error': 'Erro ao buscar matches por player e status com filtro customizado',

    // ReceiptService errors
    'ReceiptService.changeStatus.error': 'Erro ao alterar status do recibo',
    'ReceiptService.findAllByCustomFilter.error': 'Erro ao buscar recibos com filtro customizado',
    'ReceiptService.setPaymentDate.error': 'Erro ao definir data de pagamento',

    // DocumentService errors
    'documentService.addCommentDocument.error': 'Erro ao adicionar comentário no documento',
    'documentService.addDocument.error': 'Erro ao adicionar documento',
    'documentService.invalidDocumentId.error': 'ID de documento inválido',
    'documentService.listCommentsInDocument.error': 'Erro ao listar comentários no documento',

    // Alert errors
    'alert.create.error': 'Erro ao criar alerta',
    'alert.list.error': 'Erro ao listar alertas',
    'alert.update-important-flag.error': 'Erro ao atualizar flag importante do alerta',

    // Draft errors
    'draft.get.error': 'Erro ao obter rascunho',
    'draft.notFound': 'Rascunho não encontrado',
    'draft.save.error': 'Erro ao salvar rascunho',
    'draft.save.error.userExists': 'Erro ao salvar rascunho: usuário já existe',

    // Event errors
    'event.list.error': 'Erro ao listar eventos',

    // ReceiptSecureRest errors
    'ReceiptSecureRest.list.error': 'Erro ao listar recibos (REST)',

    // OpportunityMatchSecureRest errors
    'OpportunityMatchSecureRest.list.error': 'Erro ao listar matches (REST)',

    // Player errors
    'player.notFound': 'Player não encontrado',

    // OpenAI Vetor360 errors
    'openai_vetor360.API key da OpenAI não configurada': 'API key da OpenAI não configurada',
    'openai_vetor360.Erro ao buscar oportunidade Vetor360': 'Erro ao buscar oportunidade Vetor360',
    'openai_vetor360.Erro ao buscar oportunidades Vetor360': 'Erro ao buscar oportunidades Vetor360',
    'openai_vetor360.Erro ao criar oportunidade Vetor360': 'Erro ao criar oportunidade Vetor360',
    'openai_vetor360.Erro ao executar análise com OpenAI: ': 'Erro ao executar análise com OpenAI',
    'openai_vetor360.Erro ao preparar arquivos para análise com OpenAI: ': 'Erro ao preparar arquivos para análise',
    'openai_vetor360.Erro ao processar upload para OpenAI: ': 'Erro ao processar upload',
    'openai_vetor360.Erro ao vincular arquivo na oportunidade Vetor360': 'Erro ao vincular arquivo',
    'openai_vetor360.Falha ao baixar arquivo para upload na OpenAI: arquivo vazio': 'Falha ao baixar arquivo vazio',
    'openai_vetor360.Falha ao criar vector store na OpenAI': 'Falha ao criar vector store',
    'openai_vetor360.Falha ao enviar arquivo para OpenAI. Status: ': 'Falha ao enviar arquivo',
    'openai_vetor360.OpenAI não retornou ID do arquivo': 'OpenAI não retornou ID do arquivo',
    'openai_vetor360.Oportunidade Vetor360 não encontrada com ID: ': 'Oportunidade não encontrada',
    'openai_vetor360.Resposta da OpenAI não contém conteúdo analisável': 'Resposta não contém conteúdo analisável',
    'openai_vetor360.Resposta vazia da OpenAI': 'Resposta vazia da OpenAI',

    // Outras mensagens em português
    'outras_mensagens_pt.Arquivo está vazio': 'Arquivo está vazio',
    'outras_mensagens_pt.Arquivo não pode ser nulo': 'Arquivo não pode ser nulo',
    'outras_mensagens_pt.Documento não encontrado com ID: ': 'Documento não encontrado',
    'outras_mensagens_pt.Erro ao carregar configurações de prompt': 'Erro ao carregar configurações de prompt',
    'outras_mensagens_pt.Erro ao extrair texto do arquivo: ': 'Erro ao extrair texto',
    'outras_mensagens_pt.Erro ao interpretar resposta da IA para validação de arquivo': 'Erro ao interpretar resposta da IA',
    'outras_mensagens_pt.Erro ao processar análise de IA: ': 'Erro ao processar análise',
    'outras_mensagens_pt.Erro ao processar arquivo PDF: ': 'Erro ao processar PDF',
    'outras_mensagens_pt.Erro ao processar matching: ': 'Erro ao processar matching',
    'outras_mensagens_pt.Erro ao processar validação de arquivo: ': 'Erro ao processar validação',
    'outras_mensagens_pt.Extração de texto de PDF ainda não está implementada. Por favor, converta para imagem ou texto.': 'Extração de PDF não implementada',
    'outras_mensagens_pt.Extração de texto de Word ainda não está implementada. Por favor, converta para imagem ou texto.': 'Extração de Word não implementada',
    'outras_mensagens_pt.ID do documento não pode ser nulo ou vazio': 'ID do documento obrigatório',
    'outras_mensagens_pt.Invalid dates': 'Datas inválidas',
    'outras_mensagens_pt.Nenhum arquivo carregado na OpenAI encontrado': 'Nenhum arquivo encontrado',
    'outras_mensagens_pt.Não foi possível baixar o arquivo: ': 'Não foi possível baixar arquivo',
    'outras_mensagens_pt.Ocorreu um erro ao pesquisar os itens': 'Erro ao pesquisar itens',
    'outras_mensagens_pt.Ocorreu um erro ao salvar um produto': 'Erro ao salvar produto',
    'outras_mensagens_pt.Oportunidade não encontrada com ID: ': 'Oportunidade não encontrada',
    'outras_mensagens_pt.Request de validação de arquivo não pode ser nulo': 'Request de validação obrigatório',
    'outras_mensagens_pt.Resposta inválida da IA ao validar o arquivo': 'Resposta inválida da IA'
};

/**
 * Mensagem padrão quando não há tradução disponível
 */
const DEFAULT_ERROR_MESSAGE = 'Erro desconhecido';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {

    /**
     * Obtém a mensagem de erro tratada a partir de uma resposta HTTP
     * @param error - Erro HTTP ou objeto de erro do backend
     * @returns Mensagem de erro traduzida ou mensagem padrão
     */
    getErrorMessage(error: any): string {
        // Se for um HttpErrorResponse, extrai o error.error
        if (error instanceof HttpErrorResponse) {
            return this.extractMessage(error.error);
        }

        // Se já for o objeto de erro do backend
        if (error && typeof error === 'object') {
            return this.extractMessage(error);
        }

        // Se for uma string
        if (typeof error === 'string') {
            return this.translateMessage(error);
        }

        return DEFAULT_ERROR_MESSAGE;
    }

    /**
     * Extrai e traduz a mensagem do objeto de erro do backend
     * @param errorResponse - Objeto de erro do backend
     * @returns Mensagem traduzida
     */
    private extractMessage(errorResponse: BackendErrorResponse | any): string {
        // Verifica se existe a propriedade message
        if (errorResponse?.message) {
            return this.translateMessage(errorResponse.message);
        }

        // Verifica se existe a propriedade error (alguns backends retornam assim)
        if (errorResponse?.error) {
            // Se error for uma string, tenta traduzir
            if (typeof errorResponse.error === 'string') {
                return this.translateMessage(errorResponse.error);
            }
            // Se error for um objeto, tenta extrair a message dele
            if (errorResponse.error?.message) {
                return this.translateMessage(errorResponse.error.message);
            }
        }

        return DEFAULT_ERROR_MESSAGE;
    }

    /**
     * Traduz uma mensagem de erro usando o mapeamento
     * @param message - Código ou mensagem de erro
     * @returns Mensagem traduzida ou a mensagem original se não houver tradução
     */
    private translateMessage(message: string): string {
        if (!message || typeof message !== 'string') {
            return DEFAULT_ERROR_MESSAGE;
        }

        // Verifica se existe tradução no mapeamento
        if (ERROR_MESSAGES_MAP[message]) {
            return ERROR_MESSAGES_MAP[message];
        }

        // Se não houver tradução, retorna a mensagem original
        // ou a mensagem padrão se a mensagem estiver vazia
        return DEFAULT_ERROR_MESSAGE;
    }

    /**
     * Adiciona um novo mapeamento de erro
     * Útil para adicionar traduções dinamicamente
     * @param code - Código do erro
     * @param message - Mensagem traduzida
     */
    addErrorMapping(code: string, message: string): void {
        ERROR_MESSAGES_MAP[code] = message;
    }

    /**
     * Obtém todos os mapeamentos de erro
     * Útil para debug ou configuração
     */
    getErrorMappings(): { [key: string]: string } {
        return { ...ERROR_MESSAGES_MAP };
    }
}

