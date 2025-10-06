import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CardComponent, KanbanCard, KanbanColumn, KanbanComponent, IconComponent, ModalComponent } from '../../../shared/components';
import { ModalService } from '../../../shared/services/modal/modal.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    KanbanComponent,
    CardComponent,
    IconComponent,
    ModalComponent
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private modalService = inject(ModalService);

  kanbanColumns: KanbanColumn[] = [];

  ngOnInit() {
    this.initializeKanbanData();
  }

  private initializeKanbanData() {
    this.kanbanColumns = [
      {
        id: 'todo',
        title: 'Criada',
        cards: [
          {
            id: '1',
            title: 'C76324',
            description: 'Criar sistema de login e registro de usuários',
            priority: 'high',
            client: 'João Silva',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-15'),
            tags: ['backend', 'security']
          },
          {
            id: '2',
            title: 'C76324',
            description: 'Criar wireframes e mockups para o painel principal',
            priority: 'medium',
            client: 'Maria Santos',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-20'),
            tags: ['design', 'ui/ux']
          },
          {
            id: '3',
            title: 'C76324',
            description: 'Implementar pipeline de deploy automático',
            priority: 'low',
            client: 'Pedro Costa',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-25'),
            tags: ['devops', 'deployment']
          }
        ]
      },
      {
        id: 'in-progress',
        title: 'Em andamento',
        cards: [
          {
            id: '4',
            title: 'C76324',
            description: 'Criar endpoints para gerenciamento de dados',
            priority: 'high',
            client: 'Ana Oliveira',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-10'),
            tags: ['backend', 'api']
          },
          {
            id: '5',
            title: 'C76324',
            description: 'Criar cobertura de testes para componentes críticos',
            priority: 'medium',
            client: 'Carlos Lima',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-18'),
            tags: ['testing', 'quality']
          }
        ]
      },
      {
        id: 'review',
        title: 'Revisão',
        cards: [
          {
            id: '6',
            title: 'C76324',
            description: 'Melhorar estrutura e performance do código existente',
            priority: 'medium',
            client: 'Lucas Ferreira',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-12'),
            tags: ['refactoring', 'performance']
          }
        ]
      },
      {
        id: 'done',
        title: 'Finalizado',
        cards: [
          {
            id: '7',
            title: 'C76324',
            description: 'Inicializar estrutura base do projeto com design system',
            priority: 'low',
            client: 'Sofia Alves',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-01-30'),
            tags: ['setup', 'configuration']
          },
          {
            id: '8',
            title: 'C76324',
            description: 'Desenvolver componentes reutilizáveis e documentação',
            priority: 'high',
            client: 'Rafael Mendes',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-05'),
            tags: ['design-system', 'components']
          },
          {
            id: 'custom-card-1',
            title: 'C76324',
            description: 'Este card usa template customizado',
            priority: 'medium',
            client: 'Desenvolvedor',
            cnpj: '27.722.892/0001-90',
            dueDate: new Date('2024-02-15'),
            tags: ['custom', 'template']
          }
        ]
      }
    ];
  }

  onCardMoved(event: any) {
    console.log('Card movido:', event);
    // Aqui você pode implementar a lógica para salvar no backend
  }

  onCardAdded(event: any) {
    console.log('Card adicionado:', event);
    // Lógica para adicionar card no backend
  }

  onCardRemoved(event: any) {
    console.log('Card removido:', event);
    // Lógica para remover card do backend
  }

  onColumnAdded(event: any) {
    console.log('Coluna adicionada:', event);
    // Lógica para adicionar coluna no backend
  }

  onColumnRemoved(event: any) {
    console.log('Coluna removida:', event);
    // Lógica para remover coluna do backend
  }

  onColumnRenamed(event: any) {
    console.log('Coluna renomeada:', event);
    // Lógica para renomear coluna no backend
  }

  removeCard(card: KanbanCard, columnId: string) {
    const column = this.kanbanColumns.find(col => col.id === columnId);
    if (column) {
      const index = column.cards.findIndex(c => c.id === card.id);
      if (index > -1) {
        column.cards.splice(index, 1);
        console.log('Card removido:', card);
      }
    }
  }


  openCreateSolicitationModal() {
    this.modalService.open({
      id: "example-modal",
      title: 'C76324',
      size: "md",
      showHeader: true,
      showCloseButton: true,
      closeOnBackdropClick: true,
      closeOnEscapeKey: true,
    });
  }

  onModalClosed(event: any) {
    console.log('Modal fechado:', event);
  }
}
