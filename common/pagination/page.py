from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination as RestLimitOffsetPagination


class LimitOffsetPagination(RestLimitOffsetPagination):
    ...


class TotalPageNumberPagination(PageNumberPagination):
    page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })
