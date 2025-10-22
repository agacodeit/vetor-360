/**
 * Exemplo de Integração com Rotas Existentes
 * 
 * Este arquivo mostra como integrar o sistema de perfis com as rotas que já existem no projeto
 */

import { Routes } from '@angular/router';
import { Dashboard } from '../../pages/authorized/dashboard/dashboard';
import { Signup } from '../../pages/unauthorized/signup/signup';
import { Login } from '../../pages/unauthorized/login/login';
import { Authorized } from '../../pages/authorized/authorized';
import { ForgotPasswordComponent } from '../../pages/unauthorized/forgot-password/forgot-password.component';

// Import do sistema de perfis
import { authGuard } from '../guards';
import { requireProfile, requirePermissions } from '../guards/profile.guard';
import { UserProfile } from '../types/profile.types';
import { ProfileService } from '../services/profile';

/**
 * Exemplo de como suas rotas ficariam com o sistema de perfis
 * 
 * Para usar, substitua o conteúdo do seu app.routes.ts por este:
 */
export const routesWithProfileSystem: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        children: []
    },
    {
        path: 'unauthorized',
        children: [
            {
                path: 'login',
                component: Login
            },
            {
                path: 'signup',
                component: Signup
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            }
        ]
    },
    {
        path: 'authorized',
        component: Authorized,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                // Permitir acesso para ambos os perfis
                ...requireProfile([UserProfile.GESTOR_ACESSEBANK, UserProfile.PARCEIRO_ACESSEBANK])
            }
            // Adicione mais rotas aqui conforme você criar novos componentes
        ]
    }
];

/**
 * Exemplo alternativo usando a propriedade data diretamente
 */
export const routesWithDataProperty: Routes = [
    {
        path: 'authorized',
        component: Authorized,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
                canActivate: [/* ProfileGuard */],
                data: {
                    requiredProfiles: [UserProfile.GESTOR_ACESSEBANK, UserProfile.PARCEIRO_ACESSEBANK]
                }
            }
        ]
    }
];

/**
 * Exemplo de como usar em componentes existentes
 */
export class DashboardComponentExample {
    constructor(private profileService: ProfileService) { }

    // Verificar se usuário pode ver determinada seção
    canViewAdvancedReports(): boolean {
        return this.profileService.hasPermission('reports', 'export');
    }

    // Verificar se usuário é gestor
    isGestor(): boolean {
        return this.profileService.getCurrentUser()?.userTypeEnum === UserProfile.GESTOR_ACESSEBANK;
    }

    // Verificar se usuário é parceiro
    isParceiro(): boolean {
        return this.profileService.getCurrentUser()?.userTypeEnum === UserProfile.PARCEIRO_ACESSEBANK;
    }
}

/**
 * Exemplo de template com controle de visibilidade
 */
export const templateExample = `
<!-- No seu componente dashboard.component.html -->

<div class="dashboard">
  <h1>Dashboard</h1>
  
  <!-- Seção para Gestor -->
  <div *profileIf="'GESTOR_ACESSEBANK'" class="gestor-section">
    <h2>Área do Gestor</h2>
    <div class="gestor-widgets">
      <div class="widget">Relatórios Avançados</div>
      <div class="widget">Gestão de Usuários</div>
      <div class="widget">Configurações</div>
    </div>
  </div>
  
  <!-- Seção para Parceiro -->
  <div *profileIf="'PARCEIRO_ACESSEBANK'" class="parceiro-section">
    <h2>Área do Parceiro</h2>
    <div class="parceiro-widgets">
      <div class="widget">Meus Relatórios</div>
      <div class="widget">Meu Perfil</div>
    </div>
  </div>
  
  <!-- Seção compartilhada -->
  <div *profileIf="['GESTOR_ACESSEBANK', 'PARCEIRO_ACESSEBANK']" class="shared-section">
    <h2>Informações Gerais</h2>
    <div class="shared-widgets">
      <div class="widget">Notificações</div>
      <div class="widget">Atividades Recentes</div>
    </div>
  </div>
  
  <!-- Botão baseado em permissão -->
  <button *profileIfComponent="'reports'" 
          *profileIfAction="'export'"
          class="btn btn-primary">
    Exportar Relatórios
  </button>
</div>
`;

/**
 * Exemplo de como usar em serviços
 */
export class ExampleService {
    constructor(private profileService: ProfileService) { }

    // Método que verifica permissão antes de executar
    async exportReports(): Promise<void> {
        if (!this.profileService.hasPermission('reports', 'export')) {
            throw new Error('Usuário não tem permissão para exportar relatórios');
        }

        // Lógica de exportação aqui
        console.log('Exportando relatórios...');
    }

    // Método que retorna dados diferentes baseado no perfil
    getDashboardData(): any {
        const user = this.profileService.getCurrentUser();

        if (user?.userTypeEnum === UserProfile.GESTOR_ACESSEBANK) {
            return {
                title: 'Dashboard do Gestor',
                widgets: ['reports', 'users', 'settings', 'analytics']
            };
        }

        if (user?.userTypeEnum === UserProfile.PARCEIRO_ACESSEBANK) {
            return {
                title: 'Dashboard do Parceiro',
                widgets: ['reports', 'profile']
            };
        }

        return {
            title: 'Dashboard',
            widgets: []
        };
    }
}
