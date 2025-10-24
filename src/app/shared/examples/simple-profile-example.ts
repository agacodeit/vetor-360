/**
 * Exemplo Simples de Uso do Sistema de Perfis
 * 
 * Este arquivo mostra como usar o sistema de perfis de forma prática
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile/profile.service';
import { ProfileIfDirective } from '../directives/profile-if.directive';
import { ProfilePipe } from '../pipes/profile.pipe';
import { UserProfile } from '../types/profile.types';

@Component({
  selector: 'app-simple-profile-example',
  standalone: true,
  imports: [
    CommonModule,
    ProfileIfDirective,
    ProfilePipe
  ],
  template: `
    <div class="simple-example">
      <h2>Exemplo Simples - Sistema de Perfis</h2>
      
      <!-- Informações do usuário -->
      <div class="user-info">
        <p><strong>Usuário:</strong> {{ profileService.getCurrentUser()?.name || 'Nenhum usuário' }}</p>
        <p><strong>Perfil:</strong> {{ profileService.getCurrentUser()?.userTypeEnum || 'N/A' }}</p>
      </div>

      <!-- Botões para trocar perfil -->
      <div class="profile-buttons">
        <button (click)="setGestor()" class="btn btn-primary">Sou Gestor</button>
        <button (click)="setParceiro()" class="btn btn-success">Sou Parceiro</button>
        <button (click)="clearUser()" class="btn btn-secondary">Limpar</button>
      </div>

      <!-- Conteúdo baseado no perfil -->
      <div class="content-examples">
        
        <!-- Apenas para Gestor -->
        <div *profileIf="'GESTOR_ACESSEBANK'" class="gestor-content">
          <h3>🎯 Área do Gestor</h3>
          <p>Este conteúdo só aparece para GESTOR_ACESSEBANK</p>
          <ul>
            <li>Relatórios Avançados</li>
            <li>Gestão de Usuários</li>
            <li>Configurações do Sistema</li>
          </ul>
        </div>

        <!-- Apenas para Parceiro -->
        <div *profileIf="'PARCEIRO_ACESSEBANK'" class="parceiro-content">
          <h3>🤝 Área do Parceiro</h3>
          <p>Este conteúdo só aparece para PARCEIRO_ACESSEBANK</p>
          <ul>
            <li>Meus Relatórios</li>
            <li>Meu Perfil</li>
            <li>Informações Básicas</li>
          </ul>
        </div>

        <!-- Para ambos os perfis -->
        <div *profileIf="['GESTOR_ACESSEBANK', 'PARCEIRO_ACESSEBANK']" class="shared-content">
          <h3>👥 Área Compartilhada</h3>
          <p>Este conteúdo aparece para ambos os perfis</p>
          <ul>
            <li>Dashboard</li>
            <li>Relatórios Básicos</li>
            <li>Notificações</li>
          </ul>
        </div>

        <!-- Baseado em permissão -->
        <div *profileIfComponent="'reports'" class="permission-content">
          <h3>📊 Relatórios</h3>
          <p>Este conteúdo aparece apenas para quem tem permissão de ver relatórios</p>
          <button class="btn btn-info">Ver Relatórios</button>
        </div>

      </div>

      <!-- Verificações com Pipe -->
      <div class="pipe-checks">
        <h3>Verificações com Pipe</h3>
        <div class="check-item">
          <span>Pode ver relatórios: </span>
          <span [class]="('reports' | profile:'hasPermission':'reports':'view') ? 'text-success' : 'text-danger'">
            {{ ('reports' | profile:'hasPermission':'reports':'view') ? '✅ Sim' : '❌ Não' }}
          </span>
        </div>
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
  `,
  styles: [`
    .simple-example {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .user-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .profile-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }

    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-info { background: #17a2b8; color: white; }

    .gestor-content, .parceiro-content, .shared-content, .permission-content {
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      border-left: 5px solid;
    }

    .gestor-content {
      background: #e3f2fd;
      border-left-color: #2196f3;
    }

    .parceiro-content {
      background: #e8f5e8;
      border-left-color: #4caf50;
    }

    .shared-content {
      background: #fff3e0;
      border-left-color: #ff9800;
    }

    .permission-content {
      background: #f3e5f5;
      border-left-color: #9c27b0;
    }

    .check-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .text-success { color: #28a745; font-weight: bold; }
    .text-danger { color: #dc3545; font-weight: bold; }

    h2, h3 {
      color: #333;
    }
  `]
})
export class SimpleProfileExampleComponent implements OnInit {

  constructor(public profileService: ProfileService) { }

  ngOnInit(): void {
    // Definir um usuário padrão para demonstração
    this.setGestor();
  }

  setGestor(): void {
    this.profileService.setCurrentUser({
      id: '1',
      email: 'joao@acessebank.com',
      name: 'João Silva (Gestor)',
      userTypeEnum: UserProfile.GESTOR_ACESSEBANK,
      cpfCnpj: '12345678901',
      cellphone: '11999999999',
      comercialPhone: '1133333333',
      userStatusEnum: 'ACTIVE',
      dateHourIncluded: '2024-01-01 10:00:00',
      documents: [],
      temporaryPass: false,
      masterAccessGrantedEnum: 'APPROVED',
      notifyClientsByEmail: true,
      authorized: true
    });
  }

  setParceiro(): void {
    this.profileService.setCurrentUser({
      id: '2',
      email: 'maria@acessebank.com',
      name: 'Maria Santos (Parceiro)',
      userTypeEnum: UserProfile.PARCEIRO_ACESSEBANK,
      cpfCnpj: '98765432100',
      cellphone: '11888888888',
      comercialPhone: '1144444444',
      userStatusEnum: 'ACTIVE',
      dateHourIncluded: '2024-01-01 10:00:00',
      documents: [],
      temporaryPass: false,
      masterAccessGrantedEnum: 'APPROVED',
      notifyClientsByEmail: true,
      authorized: true
    });
  }

  clearUser(): void {
    this.profileService.clearCurrentUser();
  }
}
