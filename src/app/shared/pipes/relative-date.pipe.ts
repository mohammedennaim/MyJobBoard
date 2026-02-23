import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'relativeDate',
    standalone: true
})

export class RelativeDatePipe implements PipeTransform {
    transform(dateString: string): string {
        if (!dateString) return '';
        const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
        return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}
