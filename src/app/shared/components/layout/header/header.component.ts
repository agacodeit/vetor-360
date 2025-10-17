import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionMenuComponent, ActionMenuItem } from '../../atoms/action-menu/action-menu.component';

@Component({
    selector: 'ds-header',
    imports: [
        CommonModule,
        ActionMenuComponent
    ],
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    @Output() onProfileClick = new EventEmitter<void>();

    profileMenuItems: ActionMenuItem[] = [
        { label: 'Sair', value: 'logout', icon: 'fa-solid fa-right-from-bracket' }
    ];

    onMenuSelected(item: ActionMenuItem) {
        if (item.value === 'logout') {
            this.onProfileClick.emit();
        }
    }
}
