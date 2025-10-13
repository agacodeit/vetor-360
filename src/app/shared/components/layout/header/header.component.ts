import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
    selector: 'ds-header',
    imports: [
        CommonModule,
        IconComponent
    ],
    standalone: true,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    @Output() onProfileClick = new EventEmitter<void>();

    handleProfileClick() {
        this.onProfileClick.emit();
    }
}
