import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../services/profile/profile.service';
import { ProfileIfDirective } from '../directives/profile-if.directive';
import { ProfilePipe } from '../pipes/profile.pipe';
import { UserProfile } from '../types/profile.types';

/**
 * Demo Component to showcase the Profile System
 * This component demonstrates all the features of the profile system
 */
@Component({
  selector: 'app-profile-demo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProfileIfDirective,
    ProfilePipe
  ],
  template: `
    <div class="profile-demo">
      <h1>Sistema de Perfis - Demonstração</h1>
      
      <!-- Current User Info -->
      <div class="user-info">
        <h2>Informações do Usuário</h2>
        <p><strong>Nome:</strong> {{ currentUser()?.name || 'Nenhum usuário logado' }}</p>
        <p><strong>Email:</strong> {{ currentUser()?.email || 'N/A' }}</p>
        <p><strong>Perfil:</strong> {{ currentUser()?.userTypeEnum || 'N/A' }}</p>
        <p><strong>Perfil (via Pipe):</strong> {{ null | profile:'getProfile' }}</p>
      </div>

      <!-- Profile Selection -->
      <div class="profile-selection">
        <h3>Selecionar Perfil para Teste</h3>
        <div class="profile-buttons">
          <button 
            (click)="setProfile(UserProfile.GESTOR_ACESSEBANK)"
            [class.active]="currentUser()?.userTypeEnum === UserProfile.GESTOR_ACESSEBANK"
            class="btn btn-primary">
            Gestor AcesseBank
          </button>
          <button 
            (click)="setProfile(UserProfile.PARCEIRO_ACESSEBANK)"
            [class.active]="currentUser()?.userTypeEnum === UserProfile.PARCEIRO_ACESSEBANK"
            class="btn btn-success">
            Parceiro AcesseBank
          </button>
          <button 
            (click)="clearUser()"
            class="btn btn-secondary">
            Limpar Usuário
          </button>
        </div>
      </div>

      <!-- ProfileIf Directive Examples -->
      <div class="directive-examples">
        <h3>Exemplos da Diretiva *profileIf</h3>
        
        <!-- Show only for GESTOR_ACESSEBANK -->
        <div *profileIf="'GESTOR_ACESSEBANK'" class="example-box gestor-box">
          <h4>🎯 Conteúdo Exclusivo para Gestor</h4>
          <p>Este conteúdo só aparece para usuários com perfil GESTOR_ACESSEBANK</p>
          <ul>
            <li>Relatórios Financeiros</li>
            <li>Gestão de Usuários</li>
            <li>Configurações Avançadas</li>
          </ul>
        </div>

        <!-- Show for multiple profiles -->
        <div *profileIf="['GESTOR_ACESSEBANK', 'PARCEIRO_ACESSEBANK']" class="example-box admin-box">
          <h4>👥 Conteúdo Compartilhado</h4>
          <p>Este conteúdo aparece para Gestores e Parceiros</p>
          <ul>
            <li>Dashboard Compartilhado</li>
            <li>Relatórios Básicos</li>
            <li>Informações Gerais</li>
          </ul>
        </div>

        <!-- Show based on permissions -->
        <div *profileIfComponent="'reports'" class="example-box permission-box">
          <h4>📊 Exportação de Relatórios</h4>
          <p>Este botão só aparece para usuários com permissão de exportar relatórios</p>
          <button class="btn btn-primary">Exportar Relatórios</button>
        </div>

        <!-- Hide for specific profile -->
        <div *profileIf="'PARCEIRO_ACESSEBANK'" class="example-box restricted-box" [style.display]="'none'">
          <h4>🔒 Conteúdo Restrito</h4>
          <p>Este conteúdo NÃO aparece para Parceiros AcesseBank</p>
          <ul>
            <li>Informações Confidenciais</li>
            <li>Dados Internos</li>
            <li>Configurações Sensíveis</li>
          </ul>
        </div>
      </div>

      <!-- ProfilePipe Examples -->
      <div class="pipe-examples">
        <h3>Exemplos do ProfilePipe</h3>
        
        <div class="permission-checks">
          <h4>Verificações de Permissão</h4>
          <div class="check-item">
            <span>Pode ver relatórios: </span>
            <span [class]="('reports' | profile:'hasPermission':'reports':'view') ? 'text-success' : 'text-danger'">
              {{ ('reports' | profile:'hasPermission':'reports':'view') ? '✅ Sim' : '❌ Não' }}
            </span>
          </div>
          <div class="check-item">
            <span>Pode exportar relatórios: </span>
            <span [class]="('reports' | profile:'hasPermission':'reports':'export') ? 'text-success' : 'text-danger'">
              {{ ('reports' | profile:'hasPermission':'reports':'export') ? '✅ Sim' : '❌ Não' }}
            </span>
          </div>
          <div class="check-item">
            <span>Pode gerenciar usuários: </span>
            <span [class]="('users' | profile:'hasPermission':'users':'manage') ? 'text-success' : 'text-danger'">
              {{ ('users' | profile:'hasPermission':'users':'manage') ? '✅ Sim' : '❌ Não' }}
            </span>
          </div>
        </div>

        <div class="profile-checks">
          <h4>Verificações de Perfil</h4>
          <div class="check-item">
            <span>É Gestor: </span>
            <span [class]="('GESTOR_ACESSEBANK' | profile:'hasProfile') ? 'text-success' : 'text-danger'">
              {{ ('GESTOR_ACESSEBANK' | profile:'hasProfile') ? '✅ Sim' : '❌ Não' }}
            </span>
          </div>
          <div class="check-item">
            <span>É Parceiro: </span>
            <span [class]="('PARCEIRO_ACESSEBANK' | profile:'hasProfile') ? 'text-success' : 'text-danger'">
              {{ ('PARCEIRO_ACESSEBANK' | profile:'hasProfile') ? '✅ Sim' : '❌ Não' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Service Method Examples -->
      <div class="service-examples">
        <h3>Exemplos de Métodos do Serviço</h3>
        
        <div class="method-demo">
          <h4>Verificações Programáticas</h4>
          <div class="demo-item">
            <button (click)="checkPermission('reports', 'view')" class="btn btn-sm">
              Verificar Permissão: reports:view
            </button>
            <span class="result">{{ permissionResult }}</span>
          </div>
          <div class="demo-item">
            <button (click)="checkMultiplePermissions()" class="btn btn-sm">
              Verificar Múltiplas Permissões
            </button>
            <span class="result">{{ multiplePermissionsResult }}</span>
          </div>
          <div class="demo-item">
            <button (click)="getUserPermissions()" class="btn btn-sm">
              Listar Todas as Permissões
            </button>
            <div class="permissions-list">
              <div *ngFor="let permission of userPermissions" class="permission-item">
                {{ permission.component }}{{ permission.action ? ':' + permission.action : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Example -->
      <div class="navigation-example">
        <h3>Navegação Condicional</h3>
        <nav class="demo-nav">
          <a routerLink="/dashboard" 
             *ngIf="profileService.hasPermission('dashboard', 'view')"
             class="nav-link">
            🏠 Dashboard
          </a>
          <a routerLink="/reports" 
             *ngIf="profileService.hasPermission('reports', 'view')"
             class="nav-link">
            📊 Relatórios
          </a>
          <a routerLink="/users" 
             *ngIf="profileService.hasPermission('users', 'view')"
             class="nav-link">
            👥 Usuários
          </a>
          <a routerLink="/settings" 
             *ngIf="profileService.hasPermission('settings', 'view')"
             class="nav-link">
            ⚙️ Configurações
          </a>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    .profile-demo {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .user-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .profile-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
    }

    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-warning { background: #ffc107; color: black; }
    .btn-info { background: #17a2b8; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-sm { padding: 5px 10px; font-size: 12px; }

    .btn.active {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .example-box {
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      border-left: 5px solid;
    }

    .gestor-box {
      background: #e3f2fd;
      border-left-color: #2196f3;
    }

    .admin-box {
      background: #f3e5f5;
      border-left-color: #9c27b0;
    }

    .permission-box {
      background: #e8f5e8;
      border-left-color: #4caf50;
    }

    .restricted-box {
      background: #ffebee;
      border-left-color: #f44336;
    }

    .check-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .text-success { color: #28a745; font-weight: bold; }
    .text-danger { color: #dc3545; font-weight: bold; }

    .demo-item {
      margin: 10px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .result {
      font-weight: bold;
      color: #007bff;
    }

    .permissions-list {
      max-height: 200px;
      overflow-y: auto;
      background: #f8f9fa;
      padding: 10px;
      border-radius: 5px;
      margin-top: 10px;
    }

    .permission-item {
      padding: 5px 0;
      border-bottom: 1px solid #dee2e6;
    }

    .demo-nav {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .nav-link {
      padding: 10px 15px;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: background 0.3s;
    }

    .nav-link:hover {
      background: #0056b3;
    }

    h1, h2, h3, h4 {
      color: #333;
    }

    h1 {
      border-bottom: 3px solid #007bff;
      padding-bottom: 10px;
    }
  `]
})
export class ProfileDemoComponent implements OnInit {
  UserProfile = UserProfile;
  currentUser: any;

  permissionResult = '';
  multiplePermissionsResult = '';
  userPermissions: any[] = [];

  constructor(public profileService: ProfileService) {
    this.currentUser = this.profileService.currentUser;
  }

  ngOnInit(): void {
    // Set a default user for demo
    this.setProfile(UserProfile.GESTOR_ACESSEBANK);
  }

  setProfile(profile: UserProfile): void {
    const users = {
      [UserProfile.GESTOR_ACESSEBANK]: {
        id: '1',
        email: 'joao.gestor@acessebank.com',
        name: 'João Silva (Gestor)',
        userTypeEnum: UserProfile.GESTOR_ACESSEBANK,
        cpfCnpj: '12345678901',
        cellphone: '11999999999',
        comercialPhone: '1133333333',
        userStatusEnum: 'ACTIVE' as const,
        dateHourIncluded: '2024-01-01 10:00:00',
        documents: [],
        temporaryPass: false,
        masterAccessGrantedEnum: 'APPROVED' as const,
        notifyClientsByEmail: true,
        authorized: true
      },
      [UserProfile.PARCEIRO_ACESSEBANK]: {
        id: '2',
        email: 'maria.parceiro@acessebank.com',
        name: 'Maria Santos (Parceiro)',
        userTypeEnum: UserProfile.PARCEIRO_ACESSEBANK,
        cpfCnpj: '98765432100',
        cellphone: '11888888888',
        comercialPhone: '1144444444',
        userStatusEnum: 'ACTIVE' as const,
        dateHourIncluded: '2024-01-01 10:00:00',
        documents: [],
        temporaryPass: false,
        masterAccessGrantedEnum: 'APPROVED' as const,
        notifyClientsByEmail: true,
        authorized: true
      }
    };

    this.profileService.setCurrentUser(users[profile]);
  }

  clearUser(): void {
    this.profileService.clearCurrentUser();
  }

  checkPermission(component: string, action: string): void {
    const hasPermission = this.profileService.hasPermission(component, action);
    this.permissionResult = hasPermission ? '✅ Tem permissão' : '❌ Não tem permissão';
  }

  checkMultiplePermissions(): void {
    const permissions = [
      { component: 'reports', action: 'view' },
      { component: 'reports', action: 'export' }
    ];

    const hasAll = this.profileService.hasAllPermissions(permissions);
    const hasAny = this.profileService.hasAnyPermission(permissions);

    this.multiplePermissionsResult = `
      Todas: ${hasAll ? '✅' : '❌'} | 
      Qualquer: ${hasAny ? '✅' : '❌'}
    `;
  }

  getUserPermissions(): void {
    this.userPermissions = this.profileService.getCurrentUserPermissions();
  }
}
