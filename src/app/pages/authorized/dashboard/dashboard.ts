import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent, KanbanCard, KanbanColumn, KanbanComponent, IconComponent } from '../../../shared/components';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    KanbanComponent,
    CardComponent,
    IconComponent
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  kanbanColumns: KanbanColumn[] = [];

  ngOnInit() {
    this.initializeKanbanData();
  }

  private initializeKanbanData() {
    this.kanbanColumns = [
      {
        id: 'todo',
        title: 'To Do',
        cards: [
          {
            id: '1',
            title: 'Implementar autenticação',
            description: 'Criar sistema de login e registro de usuários',
            priority: 'high',
            assignee: 'João Silva',
            dueDate: new Date('2024-02-15'),
            tags: ['backend', 'security']
          },
          {
            id: '2',
            title: 'Design do dashboard',
            description: 'Criar wireframes e mockups para o painel principal',
            priority: 'medium',
            assignee: 'Maria Santos',
            dueDate: new Date('2024-02-20'),
            tags: ['design', 'ui/ux']
          },
          {
            id: '3',
            title: 'Configurar CI/CD',
            description: 'Implementar pipeline de deploy automático',
            priority: 'low',
            assignee: 'Pedro Costa',
            dueDate: new Date('2024-02-25'),
            tags: ['devops', 'deployment']
          }
        ]
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        cards: [
          {
            id: '4',
            title: 'Desenvolver API REST',
            description: 'Criar endpoints para gerenciamento de dados',
            priority: 'high',
            assignee: 'Ana Oliveira',
            dueDate: new Date('2024-02-10'),
            tags: ['backend', 'api']
          },
          {
            id: '5',
            title: 'Implementar testes unitários',
            description: 'Criar cobertura de testes para componentes críticos',
            priority: 'medium',
            assignee: 'Carlos Lima',
            dueDate: new Date('2024-02-18'),
            tags: ['testing', 'quality']
          }
        ]
      },
      {
        id: 'review',
        title: 'Review',
        cards: [
          {
            id: '6',
            title: 'Refatorar código legado',
            description: 'Melhorar estrutura e performance do código existente',
            priority: 'medium',
            assignee: 'Lucas Ferreira',
            dueDate: new Date('2024-02-12'),
            tags: ['refactoring', 'performance']
          }
        ]
      },
      {
        id: 'done',
        title: 'Done',
        cards: [
          {
            id: '7',
            title: 'Configurar projeto Angular',
            description: 'Inicializar estrutura base do projeto com design system',
            priority: 'low',
            assignee: 'Sofia Alves',
            dueDate: new Date('2024-01-30'),
            tags: ['setup', 'configuration']
          },
          {
            id: '8',
            title: 'Criar design system',
            description: 'Desenvolver componentes reutilizáveis e documentação',
            priority: 'high',
            assignee: 'Rafael Mendes',
            dueDate: new Date('2024-02-05'),
            tags: ['design-system', 'components']
          },
          {
            id: 'custom-card-1',
            title: 'Card Customizado',
            description: 'Este card usa template customizado',
            priority: 'medium',
            assignee: 'Desenvolvedor',
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
}
