import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
    @Input() loading = false;
    @Input() title = '';
    @Input() placeholder = { keyword: 'Rechercher...', location: 'Ville, région...' };
    @Output() search = new EventEmitter<{ keyword: string; location: string }>();

    searchForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.searchForm = this.fb.group({
            keyword: [''],
            location: ['']
        });
    }

    onSearch(): void {
        this.search.emit(this.searchForm.value);
    }
}
