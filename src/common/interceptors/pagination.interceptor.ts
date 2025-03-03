import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { skip = 0, take = 10, search = '' } = request.query;

        return next.handle().pipe(
            map((data) => {
                if (!Array.isArray(data.items)) {
                    return data; // Si no es una lista, devolver la respuesta original
                }

                const totalItems = data.total || data.items.length;
                const totalPages = Math.ceil(totalItems / take);
                return {
                    items: data.items,
                    meta: {
                        totalItems,
                        totalPages,
                        currentPage: Math.floor(skip / take) + 1,
                        perPage: take,
                        search, // Agregamos el término de búsqueda para referencia
                    },
                };
            }),
        );
    }
}
