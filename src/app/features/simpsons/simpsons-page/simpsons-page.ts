import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { PaginationService } from '../../../share/service/pagination-service';
import { SimpsonsService } from '../services/simpsons-service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { Pagination } from "../../../share/components/pagination-service/pagination-service";
import { HeroSimpsons } from "../components/hero-simpsons/hero-simpsons";
import { Breadcrumbs } from "../../../share/components/breadcrumbs/breadcrumbs";

@Component({
  selector: 'app-simpsons-page',
  imports: [CommonModule, RouterLink, Pagination, HeroSimpsons, Breadcrumbs],
  templateUrl: './simpsons-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpsonsPage {
  private simpsonsService = inject(SimpsonsService);
  paginationService = inject(PaginationService);

  charactersPerPage = signal(10);
  totalPages = signal(0);

   constructor() {
    effect(() => {
      if (this.simpsonsResource.hasValue()) {
        this.totalPages.set(this.simpsonsResource.value().pages);
      }
    });
  }
  
  simpsonsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.charactersPerPage(),
    }),
    stream: ({params}) => {
      return this.simpsonsService.getCharactersOptions({
        offset: params.page,
        limit: params.limit,
      });
    },
  });
}
